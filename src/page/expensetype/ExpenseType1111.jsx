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
} from "antd";
import { request } from "../../utill/request";

import dayjs from "dayjs";

import MainPage from "../../component/layout/MainPage";

function ExpenseType() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    //declare jea object
    list: [],
    total: 0,
    loading: false,
    open: false,
    validate: {},
  });
  const [validate, setValidate] = useState({});

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
    // send to api  localhost:8000/api/category?page1&text_search=admin form is query parameter
    const res = await request("categories" + query_param, "get");
    // console.log(res);
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
    formRef.resetFields();
    setValidate({});
  };

  const onFinish = async (item) => {
    let data = {
      name: item.name,
      prarent_id: item.prarent_id,
      descripttion: item.descripttion,
      status: item.status,
      // test : "Test"
    };
    // formRef.getFieldValue("id")
    let url = "categories";
    let method = "post";
    if (formRef.getFieldValue("id") != undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "put";
    }

    setState((p) => ({
      ...p,
      loading: true,
    }));

    const res = await request(url, method, data);

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

        const res = await request("categories/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const handleEdit = (data) => {
    // alert(JSON.stringify(data));
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
            <div> Expense {state.total}</div>
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
                  value: 1,
                },
                {
                  label: "In Active",
                  value: 0,
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
          title={
            formRef.getFieldValue("id") ? "Update category" : "New category"
          }
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name={"name"}
              label="category Name"
              {...validate.name}
              rules={[
                {
                  required: true,
                  message: "Field name required",
                },
              ]}
            >
              <Input placeholder="category Name" />
            </Form.Item>
            <Form.Item
              name={"prarent_id"}
              label="Parent Id"
              {...validate.prarent_id}
              rules={[
                {
                  required: true,
                  message: "Field code required",
                },
              ]}
            >
              <Input placeholder="category code" />
            </Form.Item>
            <Form.Item
              name={"descripttion"}
              label="Description"
              {...validate.descripttion}
            >
              <Input.TextArea placeholder="Description" />
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
                    label: "In Active",
                    value: 0,
                  },
                ]}
              />
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
              key: "descripttion",
              title: "Description",
              dataIndex: "descripttion",
            },
            {
              key: "prarent_id",
              title: "Parent_Id",
              dataIndex: "prarent_id",
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
export default ExpenseType;
