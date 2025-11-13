import React, { useEffect, useState } from "react";
import {
  Space,
  Input,
  Button,
  List,
  Table,
  message,
  Modal,
  Tag,
  Form,
  Select,
  notification,
  Spin,
  Image,
  Upload,
  InputNumber,
  Row,
  Col,
} from "antd";
import { request } from "../../utill/request";
import dayjs from "dayjs";
import { dateClient, isPermissionAction } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";
import config from "../../utill/config";
import UploadButton from "../../component/button/UploadButton";

function ProductPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    //declare jea object
    list: [],
    category: [],
    brand: [],
    total: 0,
    loading: false,
    open: false,
    // validate: {},
  });
  const [validate, setValidate] = useState({});
  const [fileList, setFileList] = useState([]);

  const [filter, setFilter] = useState({
    text_search: null,
    status: null,
    category_id: null,
    brand_id: null,
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async (param_filter = {}) => {
    param_filter = {
      ...filter,
      ...param_filter,
    };
    setState((p) => ({
      ...p,
      loading: true,
    }));

    let query_param = "?page=1";
    if (param_filter.text_search != null && param_filter.text_search != "") {
      query_param += "&text_search=" + param_filter.text_search;
    }
    if (param_filter.status != null && param_filter.status != null) {
      query_param += "&status=" + param_filter.status;
    }
    if (param_filter.category_id != null && param_filter.category_id != "") {
      query_param += "&category_id=" + param_filter.category_id;
    }
    if (param_filter.brand_id != null && param_filter.brand_id != "") {
      query_param += "&brand_id=" + param_filter.brand_id;
    }
    // send to api  localhost:8000/api/category?page1&text_search=admin form is query parameter
    const res = await request("products" + query_param, "get");
    // console.log(res);
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list,
        // use in choose combobox
        category: res.category,
        brand: res.brand,
        loading: false,
      }));
    } else {
      setState((p) => ({
        ...p,
        loading: false,
      }));
      if (res.errors?.message) {
        message.error(res.errors?.message);
      }
    }
  };

  const handleOpenModal = () => {
    setState((pre) => ({
      ...pre,
      open: true,
    }));
  };

  const handleCloseModal = () => {
    setState((pre) => ({
      ...pre,
      open: false,
    }));
    setFileList([]);
    formRef.resetFields();
    setValidate({});
  };

  const onFinish = async (item) => {
    let formData = new FormData();
    formData.append("category_id", item.category_id);
    formData.append("brand_id", item.brand_id);
    formData.append("product_name", item.product_name);
    formData.append("description", item.description);
    formData.append("quantity", item.quantity);
    formData.append("price", item.price);
    formData.append("status", item.status); //item.status

    if (item.image && item.image.file) {
      if (item.image.file.originFileObj) {
        formData.append("image", item.image.file.originFileObj);
      } else if (item.image.file?.status == "removed") {
        let image_remove = item.image.file?.name;
        formData.append("image_remove", image_remove);
      }
    }

    let url = "products";
    let method = "post";
    if (formRef.getFieldValue("id") != undefined) {
      //
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }

    setState((p) => ({
      ...p,
      loading: true,
    }));

    const res = await request(url, method, formData);

    if (res && !res.errors) {
      message.success(res.message);
      handleCloseModal();
      getList();
    } else {
      //console.log("error obj",res);
      setState((p) => ({
        ...p,
        loading: false,
        //validate : res.error,
      }));
      setValidate(res.errors);
    }
  };

  const handleDelete = async (data) => {
    //alert(JSON.stringify(data));
    Modal.confirm({
      title: "Delete",
      content: "Are you sur to Delete",
      onOk: async () => {
        setState((p) => ({
          ...p,
          loading: true,
        }));

        const res = await request("products/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const handleEdit = (data) => {
    // alert(JSON.stringify(data));
    setFileList([
      {
        uid: data.id,
        name: data.image,
        status: "done",
        url: config.image_path + data.image,
      },
    ]);
    formRef.setFieldsValue({
      //step: 2
      ...data,
      // description: "aa",
      status: data.status, // 0 or 1
      // status: Number(data.status),
      id: data.id,
    });
    setState((p) => ({
      ...p,
      open: true,
    }));
  };

  const handleFilter = () => {
    getList();
  };

  const handleReset = () => {
    const data = {
      text_search: null,
      status: null,
      category_id: null,
      brand_id: null,
    };
    setFilter(data);
    getList(data);
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <h1>
          {filter.text_search}-{filter.status}
        </h1>
        <div className="main-page-header">
          <Space>
            <div className="text-blue-500 font-bold text-xl">
              {" "}
              Product {state.total}
            </div>
            <Input.Search
              value={filter.text_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              allowClear
              placeholder="Search"
            />
            <Select
              allowClear={true}
              value={filter.status}
              placeholder="Select Status"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "In Active",
                  value: 0,
                },
              ]}
            />
            {/* render data into combobox */}
            <Select
              allowClear={true}
              value={filter.category_id}
              placeholder="Select Category"
              style={{ width: 150 }}
              onChange={(value) =>
                setFilter((p) => ({ ...p, category_id: value }))
              }
              options={state.category?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
            {/* render data into combobox */}
            <Select
              allowClear={true}
              value={filter.brand_id}
              placeholder="Select Brand"
              style={{ width: 150 }}
              onChange={(value) =>
                setFilter((p) => ({ ...p, brand_id: value }))
              }
              options={state.brand?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
            <Button onClick={handleReset}>Reset</Button>
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>

          <div>
            {isPermissionAction("Product.Create") && (
              <Button type="primary" onClick={handleOpenModal}>
                New
              </Button>
            )}
          </div>
        </div>
        {/* <h1>{formRef.getFieldValue("id") + ""}</h1> */}
        <Modal
          title={formRef.getFieldValue("id") ? "Update Product" : "New Product"}
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
          maskClosable={false}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={"product_name"}
                  label="Product Name"
                  {...validate.product_name}
                  rules={[
                    {
                      required: true,
                      message: "Field product name required",
                    },
                  ]}
                >
                  <Input placeholder="Product Name" />
                </Form.Item>
                <Form.Item
                  name={"brand_id"}
                  label="Brand Id"
                  {...validate.brand_id}
                  rules={[
                    {
                      required: true,
                      message: "Field brand id required",
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    //value={filter.category_id}
                    placeholder="Select Brand"
                    style={{ width: "100%" }}
                    // onChange={(value) =>
                    //   setFilter((p) => ({ ...p, category_id: value }))
                    // }
                    options={state.brand?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name={"quantity"}
                  label="Quantity"
                  {...validate.quantity}
                  rules={[
                    {
                      required: true,
                      message: "Field quantity required",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Quantity"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={"category_id"}
                  label="Category Id"
                  {...validate.category_id}
                  rules={[
                    {
                      required: true,
                      message: "Field category id required",
                    },
                  ]}
                >
                  <Select
                    allowClear={true}
                    //value={filter.category_id}
                    placeholder="Select Category"
                    style={{ width: "100%" }}
                    // onChange={(value) =>
                    //   setFilter((p) => ({ ...p, category_id: value }))
                    // }
                    options={state.category?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name={"price"}
                  label="Price"
                  {...validate.price}
                  rules={[
                    {
                      required: true,
                      message: "Field price required",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder="price" />
                </Form.Item>
                <Form.Item name={"status"} label="Status" {...validate.status}>
                  <Select
                    placeholder="Select Status"
                    options={[
                      {
                        label: "Active",
                        value: 1,
                      },
                      {
                        label: "In active",
                        value: 0,
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name={"description"}
              label="Description"
              {...validate.description}
              rules={[
                {
                  required: true,
                  message: "Field description required",
                },
              ]}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>

            <Form.Item name={"image"} label="Image" {...validate.image}>
              <Upload
                customRequest={(e) => {
                  e.onSuccess();
                }}
                maxCount={1} // uload img one
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                }}
              >
                <UploadButton />
              </Upload>
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {formRef.getFieldValue("id") ? "Update" : "Save"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        <Table
          dataSource={state.list}
          columns={[
            {
              key: "name",
              title: "Name",
              dataIndex: "product_name",
            },
            {
              key: "category",
              title: "Category",
              dataIndex: "category",
              render: (category) => category?.name,
            },
            {
              key: "brand",
              title: "Brand",
              dataIndex: "brand",
              render: (brand) => brand?.name,
            },
            {
              key: "description",
              title: "Des",
              dataIndex: "description",
            },

            {
              key: "quantity",
              title: "Quantity",
              dataIndex: "quantity",
            },
            {
              key: "price",
              title: "Price",
              dataIndex: "price",
            },
            {
              key: "image",
              title: "Image",
              dataIndex: "image",

              render: (value) => (
                <Image src={config.image_path + value} width={70} alt="" />
              ),
            },
            {
              key: "status",
              title: "Status",
              dataIndex: "status",
              render: (value) =>
                value === 1 ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">In Active</Tag>
                ),
            },
            {
              key: "created_at",
              title: "Create At",
              dataIndex: "created_at",
              render: (value) => dateClient(value),
            },
            {
              key: "action",
              title: "Action",
              align: "center",
              dataIndex: "id",
              hidden:
                isPermissionAction("Product.Update") ||
                isPermissionAction("Product.Remove")
                  ? false
                  : true,
              render: (value, data) => (
                <Space>
                  {isPermissionAction("Product.Update") && (
                    <Button type="primary" onClick={() => handleEdit(data)}>
                      Edit
                    </Button>
                  )}
                  {isPermissionAction("Product.Remove") && (
                    <Button
                      danger
                      type="primary"
                      onClick={() => handleDelete(data)}
                    >
                      Delete
                    </Button>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </div>
    </MainPage>
  );
}
export default ProductPage;
