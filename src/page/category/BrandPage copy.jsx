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
} from "antd";
import { request } from "../../utill/request";
import dayjs from "dayjs";
import { dateClient } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";
import config from "../../utill/config";
import UploadButton from "../../component/button/UploadButton";

function BrandPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    //declare jea object
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  const [validate, setValidate] = useState({});
  const [fileList, setFileList] = useState([]);

  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState((p) => ({
      ...p,
      loading: true,
    }));

    let query_param = "?page=1";
    if (filter.text_search !== null && filter.text_search !== "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status !== null && filter.status !== "") {
      query_param += "&status=" + filter.status;
    }
    const res = await request("brands" + query_param, "get");
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list,
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
    setFileList();
    formRef.resetFields();
    setValidate({});
  };

  const onFinish = async (item) => {
    let formData = new FormData();
    formData.append("name", item.name);
    formData.append("code", item.code);
    formData.append("from_country", item.from_country);
    formData.append("status", item.status);

    if (item.image && item.image.file) {
      if (item.image.file.originFileObj) {
        formData.append("image", item.image.file.originFileObj);
      } else if (item.image.file?.status == "removed") {
        let image_remove = item.image.file?.name;
        formData.append("image_remove", image_remove);
      }
    }
    let url = "brands";
    let method = "post";
    if (formRef.getFieldValue("id") != undefined) {
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

        const res = await request("brands/" + data.id, "delete");
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
      ...data,
      // description: "aa",
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

  return (
    <MainPage loading={state.loading}>
      <div>
        <h1>
          {filter.text_search}-{filter.status}
        </h1>
        <div className="main-page-header">
          <Space>
            <div> Brand {state.total}</div>
            <Input.Search
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
              allowClear
              placeholder="Search"
            />
            <Select
              allowClear={true}
              placeholder="Select Status"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                {
                  label: "Active",
                  value: "active",
                },
                {
                  label: "In Active",
                  value: "inactive",
                },
              ]}
            />
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>

          <div>
            <Button type="primary" onClick={handleOpenModal}>
              New
            </Button>
          </div>
        </div>
        {/* <h1>{formRef.getFieldValue("id") + ""}</h1> */}
        <Modal
          title={formRef.getFieldValue("id") ? "Update Brand" : "New Brand"}
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name={"name"}
              label="Brand Name"
              {...validate.name}
              rules={[
                {
                  required: true,
                  message: "Field name required",
                },
              ]}
            >
              <Input placeholder="Brand Name" />
            </Form.Item>
            <Form.Item
              name={"code"}
              label="Code"
              {...validate.code}
              rules={[
                {
                  required: true,
                  message: "Field code required",
                },
              ]}
            >
              <Input placeholder="Brand code" />
            </Form.Item>
            <Form.Item
              name={"from_country"}
              label="From Country"
              {...validate.form_country}
              rules={[
                {
                  required: true,
                  message: "Field From_country required",
                },
              ]}
            >
              <Input placeholder="Brand From Country" />
            </Form.Item>
            <Form.Item name={"status"} label="Status" {...validate.status}>
              <Select
                placeholder="Select Status"
                options={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "In active",
                    value: "inactive",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name={"image"} label="Image">
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
                <Button>Cancel</Button>
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
              dataIndex: "name",
            },
            {
              key: "code",
              title: "Code",
              dataIndex: "code",
            },
            {
              key: "from_country",
              title: "From Country",
              dataIndex: "from_country",
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
                value ? (
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
              render: (value, data) => (
                <Space>
                  <Button type="primary" onClick={() => handleEdit(data)}>
                    Edit
                  </Button>
                  <Button
                    danger
                    type="primary"
                    onClick={() => handleDelete(data)}
                  >
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </div>
    </MainPage>
  );
}
export default BrandPage;
