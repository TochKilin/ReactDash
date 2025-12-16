import React, { useEffect, useState } from "react";
import {
  Space,
  Input,
  Button,
  Table,
  message,
  Modal,
  Form,
  Select,
} from "antd";
import { request } from "../../utill/request";
import { dateClient } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";

function UserPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
  });
  const [filter, setFilter] = useState({
    text_search: "",
    status: "",
  });
  const [validate, setValidate] = useState({});

  useEffect(() => {
    getList();
  }, []);

  // Fetch user list
  const getList = async (page = 1) => {
    setState((p) => ({ ...p, loading: true }));

    let query_param = `?page=${page}`;
    if (filter.text_search) query_param += `&text_search=${filter.text_search}`;
    if (filter.status !== "" && filter.status !== null)
      query_param += `&status=${filter.status}`;

    try {
      const res = await request("users" + query_param, "get");
      if (res && !res.errors) {
        setState((pre) => ({
          ...pre,
          total: res.total,
          list: res.data,
          loading: false,
        }));
      } else {
        setState((p) => ({ ...p, loading: false }));
        if (res.errors?.message) message.error(res.errors.message);
      }
    } catch (err) {
      setState((p) => ({ ...p, loading: false }));
      message.error("Internal Server Error");
    }
  };

  // Open modal for new/edit
  const handleOpenModal = () => setState((p) => ({ ...p, open: true }));

  const handleCloseModal = () => {
    setState((p) => ({ ...p, open: false }));
    formRef.resetFields();
    setValidate({});
  };

  // Submit form for create/update
  const onFinish = async (values) => {
    let url = "role";
    let method = "post";

    if (formRef.getFieldValue("id")) {
      url += `/${formRef.getFieldValue("id")}`;
      method = "put";
    }

    setState((p) => ({ ...p, loading: true }));

    try {
      const res = await request(url, method, values);
      if (res && !res.errors) {
        message.success(res.message);
        handleCloseModal();
        getList();
      } else {
        setState((p) => ({ ...p, loading: false }));
        setValidate(res.errors || {});
      }
    } catch (err) {
      setState((p) => ({ ...p, loading: false }));
      message.error("Internal Server Error");
    }
  };

  // Edit user
  const handleEdit = (record) => {
    formRef.setFieldsValue({ ...record, id: record.id });
    setState((p) => ({ ...p, open: true }));
  };

  // Delete user
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure you want to delete this user?",
      onOk: async () => {
        setState((p) => ({ ...p, loading: true }));
        try {
          const res = await request(`role/${record.id}`, "delete");
          if (res && !res.error) {
            message.success(res.message);
            getList();
          }
        } catch (err) {
          message.error("Delete failed");
        } finally {
          setState((p) => ({ ...p, loading: false }));
        }
      },
    });
  };

  // Apply filters
  const handleFilter = () => getList();

  const columns = [
    { key: "id", title: "ID", dataIndex: "id" },
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "email", title: "Email", dataIndex: "email" },
    {
      key: "email_verified_at",
      title: "Email Verified",
      dataIndex: "email_verified_at",
      render: (value) => value || "-",
    },
    {
      key: "created_at",
      title: "Created At",
      dataIndex: "created_at",
      render: (value) => (value ? dateClient(value) : "-"),
    },
    {
      key: "action",
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainPage loading={state.loading}>
      <div>
        <div className="main-page-header">
          <Space>
            <div>UserPage {state.total}</div>
            <Input.Search
              allowClear
              placeholder="Search"
              onChange={(e) =>
                setFilter((p) => ({ ...p, text_search: e.target.value }))
              }
            />
            <Select
              allowClear
              placeholder="Select Status"
              style={{ width: 150 }}
              onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
              options={[
                { label: "Active", value: 1 },
                { label: "In Active", value: 0 },
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

        {/* Modal form */}
        <Modal
          title={formRef.getFieldValue("id") ? "Update User" : "New User"}
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" form={formRef} onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Role Name"
              {...validate.name}
              rules={[{ required: true, message: "Field name required" }]}
            >
              <Input placeholder="Role Name" />
            </Form.Item>

            <Form.Item
              name="code"
              label="Role Code"
              {...validate.code}
              rules={[{ required: true, message: "Field code required" }]}
            >
              <Input placeholder="Role Code" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              {...validate.description}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>

            <Form.Item name="status" label="Status" {...validate.status}>
              <Select
                placeholder="Select Status"
                options={[
                  { label: "Active", value: 1 },
                  { label: "In Active", value: 0 },
                ]}
              />
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

        {/* User Table */}
        <Table dataSource={state.list} columns={columns} rowKey="id" />
      </div>
    </MainPage>
  );
}

export default UserPage;
