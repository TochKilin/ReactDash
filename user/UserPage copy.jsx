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
import MainPage from "../../component/layout/MainPage";

function UserPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    loading: false,
    open: false,
  });
  const [rolesOptions, setRolesOptions] = useState([]);

  // Load users
  const getUsers = async () => {
    setState((p) => ({ ...p, loading: true }));
    try {
      const res = await request("users", "get");
      setState((p) => ({
        ...p,
        list: res,
        loading: false,
      }));
    } catch {
      message.error("Cannot load users");
      setState((p) => ({ ...p, loading: false }));
    }
  };

  // Load roles
  const getRoles = async () => {
    try {
      const res = await request("roles", "get");
      if (res?.list) {
        setRolesOptions(res.list.map((r) => ({ label: r.name, value: r.id })));
      }
    } catch {
      message.error("Cannot load roles");
    }
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const handleOpenModal = () => setState((p) => ({ ...p, open: true }));

  const handleCloseModal = () => {
    setState((p) => ({ ...p, open: false }));
    formRef.resetFields();
  };

  const handleEdit = (user) => {
    formRef.setFieldsValue({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles?.map((r) => r.id),
    });
    setState((p) => ({ ...p, open: true }));
  };

  const handleDelete = (user) => {
    Modal.confirm({
      title: "Delete User",
      content: "Are you sure?",
      onOk: async () => {
        await request(`users/${user.id}`, "delete");
        message.success("Deleted successfully");
        getUsers();
      },
    });
  };

  // Save (Create or Update)
  const onFinish = async (values) => {
    setState((p) => ({ ...p, loading: true }));
    try {
      let userId = values.id;

      if (values.id) {
        // Update
        await request(`users/${values.id}`, "put", {
          name: values.name,
          email: values.email,
          roles: values.roles,
        });
      } else {
        // Create new
        const res = await request("users", "post", {
          name: values.name,
          email: values.email,
          roles: values.roles,
        });

        if (!res?.id) throw new Error("Cannot get new user ID from API");

        userId = res.id;
      }

      message.success(
        values.id ? "Updated successfully" : "Created successfully"
      );
      handleCloseModal();
      getUsers();
    } catch (error) {
      message.error(error.message || "Save failed");
    } finally {
      setState((p) => ({ ...p, loading: false }));
    }
  };

  const columns = [
    { key: "id", title: "ID", dataIndex: "id" },
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "email", title: "Email", dataIndex: "email" },
    {
      key: "roles",
      title: "Roles",
      render: (user) =>
        user.roles?.map((r) => (
          <span
            key={r.id}
            style={{ marginRight: 5 }}
            className="font-bold px-2 py-0.5 text-xs rounded-lg bg-green-100 text-green-700 border border-green-300 mr-1"
          >
            {r.name}
          </span>
        )),
    },
    {
      key: "action",
      title: "Action",
      render: (_, user) => (
        <Space>
          <Button onClick={() => handleEdit(user)}>Edit</Button>
          <Button danger onClick={() => handleDelete(user)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainPage loading={state.loading}>
      <Button
        type="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: 16 }}
        className="float-right"
      >
        New User
      </Button>

      <Table dataSource={state.list} columns={columns} rowKey="id" />

      <Modal
        title={formRef.getFieldValue("id") ? "Update User" : "New User"}
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" form={formRef} onFinish={onFinish}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="roles" label="Roles" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              options={rolesOptions}
              placeholder="Select roles"
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
    </MainPage>
  );
}

export default UserPage;
