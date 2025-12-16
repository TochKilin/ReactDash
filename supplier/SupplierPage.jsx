import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space } from "antd";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../utill/request";

function SupplierPage() {
  const [form] = Form.useForm();
  const [state, setState] = useState({ list: [], loading: false, open: false });

  const getList = async () => {
    setState((p) => ({ ...p, loading: true }));
    const res = await request("suppliers", "get");
    if (res && !res.errors)
      setState((p) => ({ ...p, list: res.list, loading: false }));
    else setState((p) => ({ ...p, loading: false }));
  };

  useEffect(() => {
    getList();
  }, []);

  const handleOpen = () => {
    form.resetFields();
    setState((p) => ({ ...p, open: true }));
  };
  const handleClose = () => setState((p) => ({ ...p, open: false }));

  const onFinish = async (values) => {
    let url = "suppliers",
      method = "post";
    if (form.getFieldValue("id")) {
      url += "/" + form.getFieldValue("id");
      method = "put";
    }
    const res = await request(url, method, values);
    if (!res.errors) {
      message.success(res.message);
      handleClose();
      getList();
    } else message.error(res.errors?.message || "Error");
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setState((p) => ({ ...p, open: true }));
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete?",
      onOk: async () => {
        const res = await request(`suppliers/${record.id}`, "delete");
        if (!res.errors) {
          message.success("Deleted");
          getList();
        }
      },
    });
  };

  return (
    <MainPage loading={state.loading}>
      <Space style={{ marginBottom: 16 }} className="flex justify-end">
        <Button type="primary" onClick={handleOpen} className="float-right">
          New Supplier
        </Button>
      </Space>
      <Modal
        open={state.open}
        onCancel={handleClose}
        footer={null}
        title={form.getFieldValue("id") ? "Update Supplier" : "New Supplier"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="tel" label="Tel">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
      <Table
        rowKey="id"
        dataSource={state.list}
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          { title: "Tel", dataIndex: "tel" },
          {
            title: "Action",
            render: (_, r) => (
              <Space>
                <Button onClick={() => handleEdit(r)}>Edit</Button>
                <Button danger onClick={() => handleDelete(r)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default SupplierPage;
