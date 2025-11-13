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
  DatePicker,
  Row,
  Col,
  Descriptions,
} from "antd";
import { request } from "../../utill/request";
import dayjs from "dayjs";
import { dateClient, isPermissionAction } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";

function EmployeePage() {
  const [formRef] = Form.useForm();
  const [state, setState] = useState({
    //declare jea object
    list: [],
    total: 0,
    loading: false,
    open: false,
    validate: {},
    // position: [],
  });
  const [viewModal, setViewModal] = useState({
    open: false,
    data: {},
  });
  const [validate, setValidate] = useState({});

  const [filter, setFilter] = useState({
    text_search: null,
    status: null,
    //position: null,
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
    const res = await request("employees" + query_param, "get");
    // console.log(res);
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list,
        //position: res.position,
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
      card_id: item.card_id,
      firstname: item.firstname,
      lastname: item.lastname,
      dob: item.dob ? item.dob.format("YYYY-MM-DD") : null,
      email: item.email,
      tel: item.tel,
      position_id: item.position_id,
      salary: item.salary,
      address: item.address,
      hire_date: item.hire_date ? item.hire_date.format("YYYY-MM-DD") : null,
      status: item.status,
      // test : "Test"
    };
    // formRef.getFieldValue("id")
    let url = "employees";
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

        const res = await request("employees/" + data.id, "delete");
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
      //step: 2
      ...data,
      dob: data.dob ? dayjs(data.dob) : null,
      hire_date: data.hire_date ? dayjs(data.hire_date) : null,
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

  const handleView = (data) => {
    setViewModal({
      open: true,
      data,
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        <h1>
          {filter.text_search}-{filter.status}
        </h1>
        <div className="main-page-header">
          <Space>
            <div> Employee {state.total}</div>
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
          title={
            formRef.getFieldValue("id") ? "Update category" : "New category"
          }
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={"card_id"}
                  label="Card Id"
                  {...validate.card_id}
                  rules={[
                    {
                      required: true,
                      message: "Field card id required",
                    },
                  ]}
                >
                  <Input placeholder="card id" />
                </Form.Item>

                <Form.Item
                  name={"firstname"}
                  label="firstname"
                  {...validate.firstname}
                  rules={[
                    {
                      required: true,
                      message: "Field first name required",
                    },
                  ]}
                >
                  <Input placeholder="first name" />
                </Form.Item>
                <Form.Item
                  name={"lastname"}
                  label="lastname"
                  {...validate.lastname}
                  rules={[
                    {
                      required: true,
                      message: "Field last name required",
                    },
                  ]}
                >
                  <Input placeholder="last name" />
                </Form.Item>

                <Form.Item
                  layout="vertical"
                  name="dob"
                  validateStatus={validate.dob ? "error" : ""}
                  help={validate.dob ? validate.dob[0] : ""}
                  label="Date of Birth"
                  getValueProps={(value) => ({
                    value: value ? dayjs(value) : null,
                  })}
                  normalize={(value) =>
                    value ? value.format("YYYY-MM-DD") : null
                  }
                  rules={[
                    { required: true, message: "Please select date of birth" },
                  ]}
                >
                  <Space direction="vertical" className="w-full">
                    <DatePicker
                      className="w-full"
                      onChange={(date) => {
                        formRef.setFieldsValue({ dob: date });
                      }}
                    />
                  </Space>
                </Form.Item>

                <Form.Item
                  name={"email"}
                  label="email"
                  {...validate.email}
                  rules={[
                    {
                      required: true,
                      message: "Field email  required",
                    },
                  ]}
                >
                  <Input placeholder="email" />
                </Form.Item>

                <Form.Item
                  name={"tel"}
                  label="tel"
                  {...validate.tel}
                  rules={[
                    {
                      required: true,
                      message: "Field tel required",
                    },
                  ]}
                >
                  <Input placeholder="tel" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={"salary"}
                  label="Salary"
                  {...validate.salary}
                  rules={[
                    {
                      required: true,
                      message: "Field salary required",
                    },
                  ]}
                >
                  <Input placeholder="salary" />
                </Form.Item>

                <Form.Item
                  name={"address"}
                  label="Address"
                  {...validate.address}
                  rules={[
                    {
                      required: true,
                      message: "Field address required",
                    },
                  ]}
                >
                  <Input placeholder="address" />
                </Form.Item>

                <Form.Item
                  layout="vertical"
                  name="hire_date"
                  label="Hire Date"
                  validateStatus={validate.hire_date ? "error" : ""}
                  help={validate.hire_date ? validate.hire_date[0] : ""}
                  rules={[
                    { required: true, message: "Please select Hire Date" },
                  ]}
                >
                  <Space direction="vertical" className="w-full">
                    <DatePicker
                      format="YYYY-MM-DD"
                      className="w-full"
                      onChange={(date) => {
                        formRef.setFieldsValue({ hire_date: date });
                      }}
                    />
                  </Space>
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
                        label: "In Active",
                        value: "inactive",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* {dob && <p>📅 Selected DOB: {dob}</p>}
            </Form> */}

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

        {/* view model */}

        <Modal
          title="Employee Detail"
          open={viewModal.open}
          onCancel={() => setViewModal({ open: false, data: {} })}
          footer={null}
        >
          <Descriptions bordered size="full" column={1}>
            <Descriptions.Item label="ID">
              {viewModal.data.id}
            </Descriptions.Item>
            <Descriptions.Item label="Card_ID">
              {viewModal.data.card_id}
            </Descriptions.Item>
            <Descriptions.Item label="First Name">
              {viewModal.data.firstname}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {viewModal.data.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Date Of Birth ID">
              {dateClient(viewModal.data.dob)}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {viewModal.data.email}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              {viewModal.data.position_id}
            </Descriptions.Item>
            <Descriptions.Item label="Tel">
              {viewModal.data.tel}
            </Descriptions.Item>
            <Descriptions.Item label="Salary">
              {viewModal.data.salary}
            </Descriptions.Item>
            <Descriptions.Item label="address">
              {viewModal.data.address}
            </Descriptions.Item>
            <Descriptions.Item label="Hire Data">
              {dateClient(viewModal.data.hire_date)}
            </Descriptions.Item>
            <Descriptions.Item label="status">
              {viewModal.data.status}
            </Descriptions.Item>
          </Descriptions>
        </Modal>

        <Table
          dataSource={state.list}
          columns={[
            {
              key: "card_id",
              title: "card_id",
              dataIndex: "card_id",
            },

            {
              key: "firstname",
              title: "Firstname",
              dataIndex: "firstname",
            },
            {
              key: "lastname",
              title: "lastname",
              dataIndex: "lastname",
            },
            {
              key: "dob",
              title: "dob",
              dataIndex: "dob",
            },

            {
              key: "email",
              title: "email",
              dataIndex: "email",
            },
            {
              key: "tel",
              title: "tel",
              dataIndex: "tel",
            },
            {
              key: "salary",
              title: "salary",
              dataIndex: "salary",
              render: (value) =>
                `$${parseFloat(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
            },
            {
              key: "address",
              title: "address",
              dataIndex: "address",
            },
            {
              key: "hire_date",
              title: "hire_date",
              dataIndex: "hire_date",
            },

            {
              key: "status",
              title: "Status",
              dataIndex: "status",
              render: (value) =>
                value === "active" ? (
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
                  <Button type="primary" onClick={() => handleView(data)}>
                    View
                  </Button>
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
export default EmployeePage;
