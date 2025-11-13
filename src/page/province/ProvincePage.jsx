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
import { dateClient } from "../../utill/helper";
import MainPage from "../../component/layout/MainPage";

function ProvincePage() {
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
    if (filter.text_search != null && filter.text_search !== "") {
      query_param += "&text_search=" + filter.text_search;
    }
    if (filter.status != null && filter.status != "") {
      query_param += "&status=" + filter.status;
    }
    // send to api  localhost:8000/api/provinces?page1&text_search=admin form is query parameter
    const res = await request("provinces" + query_param, "get");
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
    formRef.setFieldValue("status", 1);
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
      code: item.code,
      description: item.description,
      status: item.status,
      //test : "Test"
      distand_from_city: item.distand_from_city,
    };
    // formRef.getFieldValue("id")
    let url = "provinces";
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
    // console.log("Check res in page",res);
    // console.log(item);
    //console.log(res);
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
      // message.error(res.message);
      // message.error(res.errors.name[0]);
      //setValidate(res.validate)
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

        const res = await request("provinces/" + data.id, "delete");
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
    // const res = await request("provinces/"+ data.id,"delete");
    // if(res && !res.error){
    //     message.success(res.message);
    //     getList();
    // }
  };

  const handleEdit = (data) => {
    // alert(JSON.stringify(data));
    formRef.setFieldsValue({
      //step:  1
      // name: data.name,
      // code:data.code,
      // description:data.description,
      // status:data.status,

      //step: 2
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
            <div> Province {state.total}</div>
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
          title={formRef.getFieldValue("id") ? "Update Role" : "New Role"}
          open={state.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinish} form={formRef}>
            <Form.Item
              name={"name"}
              label="Province Name"
              {...validate.name}
              rules={[
                {
                  required: true,
                  message: "Field name required",
                },
              ]}
            >
              <Input placeholder="Province Name" />
            </Form.Item>
            <Form.Item
              name={"code"}
              label="Province code"
              {...validate.code}
              rules={[
                {
                  required: true,
                  message: "Field code required",
                },
              ]}
            >
              <Input placeholder="Province code" />
            </Form.Item>

            <Form.Item
              name={"description"}
              label="Description"
              {...validate.description}
            >
              <Input.TextArea placeholder="Description" />
            </Form.Item>

            <Form.Item
              name={"distand_from_city"}
              label="Distand From City(km)"
              rules={[
                {
                  required: true,
                  message: "Field name required",
                },
              ]}
              {...validate.distand_from_city}
            >
              <Input placeholder="Distand From City" />
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
              key: "code",
              title: "Code",
              dataIndex: "code",
            },
            {
              key: "description",
              title: "Description",
              dataIndex: "description",
            },
            {
              key: "distand_from_city",
              title: "Distand From City",
              dataIndex: "distand_from_city",
              render: (value) => value + " " + "Km",
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
        {/* {state.list?.map((item,index)=>(
            <div key={index} style={{marginBottom: 10}}>
                <div>{item.name}-{item.code}</div>
                <div>{item.status ?"Active":"In Active"}</div>
            </div>
        ))} */}
      </div>
    </MainPage>
  );
}
export default ProvincePage;
