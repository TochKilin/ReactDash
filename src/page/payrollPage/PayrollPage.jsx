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
  InputNumber,
} from "antd";
import { request } from "../../utill/request";
import { dateClient, isPermissionAction } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";

function PayrollPage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    employee: [],
    total: 0,
    loading: false,
    open: false,
  });

  const [filter, setFilter] = useState({
    text_search: null,
    status: null,
  });

  const [validate, setValidate] = useState({});

  useEffect(() => {
    getList();
  }, []);

  const getList = async (param_filter = {}) => {
    param_filter = { ...filter, ...param_filter };
    setState((p) => ({ ...p, loading: true }));

    let query_param = "?page=1";
    if (param_filter.text_search)
      query_param += "&text_search=" + param_filter.text_search;
    if (param_filter.status !== null)
      query_param += "&status=" + param_filter.status;

    const res = await request("employee_payrolls" + query_param, "get");
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.list?.length || 0,
        list: res.list,
        employee: res.employee,
        loading: false,
      }));
    } else {
      setState((p) => ({ ...p, loading: false }));
      if (res.errors?.message) message.error(res.errors?.message);
    }
  };

  const handleOpenModal = () => setState((p) => ({ ...p, open: true }));
  const handleCloseModal = () => {
    setState((p) => ({ ...p, open: false }));
    formRef.resetFields();
    setValidate({});
  };

  const onFinish = async (item) => {
    let formData = new FormData();
    formData.append("employee_id", Number(item.employee_id));
    formData.append("base_salary", Number(item.base_salary));
    formData.append("ot", Number(item.ot));
    formData.append("card", Number(item.card));
    formData.append("net_salary", Number(item.net_salary));

    let url = "employee_payrolls";
    let method = "post";
    if (formRef.getFieldValue("id") !== undefined) {
      url += "/" + formRef.getFieldValue("id");
      method = "post";
      formData.append("_method", "PUT");
    }

    setState((p) => ({ ...p, loading: true }));
    const res = await request(url, method, formData);
    if (res && !res.errors) {
      message.success(res.message);
      handleCloseModal();
      getList();
    } else {
      setState((p) => ({ ...p, loading: false }));
      setValidate(res.errors);
    }
  };

  const handleDelete = async (data) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure to delete?",
      onOk: async () => {
        setState((p) => ({ ...p, loading: true }));
        const res = await request("employee_payrolls/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const handleEdit = (data) => {
    formRef.setFieldsValue({ ...data });
    handleOpenModal();
  };

  const handleFilter = () => getList();
  const handleReset = () => {
    const data = { text_search: null, status: null };
    setFilter(data);
    getList(data);
  };

  return (
    <MainPage loading={state.loading}>
      <div className="main-page-header flex justify-between items-center mb-4">
        <Space>
          <div className="text-blue-500 font-bold text-xl">
            PayrollPage {state.total}
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
            allowClear
            value={filter.status}
            placeholder="Select Status"
            style={{ width: 150 }}
            onChange={(value) => setFilter((p) => ({ ...p, status: value }))}
            options={[
              { label: "Active", value: 1 },
              { label: "In Active", value: 0 },
            ]}
          />
          <Button onClick={handleReset}>Reset</Button>
          <Button type="primary" onClick={handleFilter}>
            Filter
          </Button>
        </Space>
        <Button type="primary" onClick={handleOpenModal}>
          + New Salary
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h2 className="text-lg text-blue-600 mb-1">Total Salary</h2>
          <div className="text-2xl font-bold text-blue-700">
            $
            {state.list
              ?.reduce((sum, i) => sum + (Number(i.net_salary) || 0), 0)
              .toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h2 className="text-lg text-green-600 mb-1">Total Staff</h2>
          <div className="text-2xl font-bold text-green-700">
            {state.list?.length || 0}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <h2 className="text-lg text-purple-600 mb-1">Total Spend</h2>
          <div className="text-2xl font-bold text-purple-700">
            $
            {state.list
              ?.reduce(
                (sum, i) =>
                  sum + (Number(i.net_salary) || 0) + (Number(i.ot) || 0),
                0
              )
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        title={formRef.getFieldValue("id") ? "Update Salary" : "New Salary"}
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            name="employee_id"
            label="Select Employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select
              placeholder="Select Employee"
              style={{ width: "100%" }}
              options={state.employee?.map((e) => ({
                label: `${e.firstname} ${e.lastname}`,
                value: e.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="base_salary"
            label="Base Salary"
            rules={[{ required: true, message: "Field base salary required" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="ot" label="OT">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="card" label="Card">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="net_salary"
            label="Net Salary"
            rules={[{ required: true, message: "Field net salary required" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
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

      {/* Table */}
      <Table
        dataSource={state.list}
        rowKey="id"
        columns={[
          {
            title: "Employee Name",
            dataIndex: "employee",
            key: "employee",
            render: (e) => `${e?.firstname} ${e?.lastname}`,
          },
          {
            title: "Base Salary",
            dataIndex: "base_salary",
            key: "base_salary",
            render: (v) => `$ ${v}`,
          },
          { title: "OT", dataIndex: "ot", key: "ot" },
          { title: "Card", dataIndex: "card", key: "card" },
          {
            title: "Net Salary",
            key: "net_salary",
            render: (_, record) => {
              const total =
                (Number(record.base_salary) || 0) +
                (Number(record.ot) || 0) +
                (Number(record.card) || 0);
              return (
                <span className="text-red-600 font-bold">
                  ${total.toLocaleString()}
                </span>
              );
            },
          },
          {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (v) => dateClient(v),
          },
          {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, data) => (
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
    </MainPage>
  );
}

export default PayrollPage;
