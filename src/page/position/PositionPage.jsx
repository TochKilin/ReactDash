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

function PositionPage() {
  const [formRef] = Form.useForm();

  const [viewModal, setViewModal] = useState({
    open: false,
    data: {},
  });

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
    const res = await request("positions" + query_param, "get");
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
      description: item.description,
      parent_id: item.parent_id,
    };
    // formRef.getFieldValue("id")
    let url = "positions";
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

        const res = await request("positions/" + data.id, "delete");
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

  const handleView = (data) => {
    setViewModal({
      open: true,
      data,
    });
  };

  const handleFilter = () => {
    getList();
  };

  return (
    <MainPage loading={state.loading}>
      <div>
        {/* <h1>
          {filter.text_search}-{filter.status}
        </h1> */}
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

        <Modal
          title={
            formRef.getFieldValue("id") ? "Update position" : "New position"
          }
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name={"name"}
              label="Name"
              {...validate.name}
              rules={[
                {
                  required: true,
                  message: "Feild name required",
                },
              ]}
            >
              <Input placeholder="name" />
            </Form.Item>

            <Form.Item
              name={"description"}
              label="Description"
              {...validate.description}
              rules={[
                {
                  required: true,
                  message: "Feild description required",
                },
              ]}
            >
              <Input placeholder="description" />
            </Form.Item>
            <Form.Item
              name={"parent_id"}
              label="parent_id"
              {...validate.parent_id}
              rules={[
                {
                  required: true,
                  message: "Feild parent id required",
                },
              ]}
            >
              <Input placeholder="parent id" />
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

        {/* view model */}

        <Modal
          title="Position Detail"
          open={viewModal.open}
          onCancel={() => setViewModal({ open: false, data: {} })}
          footer={null}
        >
          <Descriptions bordered size="big" column={1}>
            <Descriptions.Item label="ID">
              {viewModal.data.id}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {viewModal.data.name}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {viewModal.data.description}
            </Descriptions.Item>
            <Descriptions.Item label="Parent ID">
              {viewModal.data.parent_id}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dateClient(viewModal.data.created_at)}
            </Descriptions.Item>
          </Descriptions>
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
              key: "description",
              title: "Description",
              dataIndex: "description",
            },
            {
              key: "parent_id",
              title: "parent id",
              dataIndex: "parent_id",
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
export default PositionPage;
