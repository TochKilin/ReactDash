import React, { useState } from "react";
import {
  LockOutlined,
  PhoneFilled,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Image,
  Upload,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
//import {create} from "zustand";
import { profileStore } from "../../store/profileStore";
// import { setAccessToken } from "../../Store/profileStore";
import { request } from "../../utill/request";
//import { Image, Upload } from "antd";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterPage = () => {
  const { setProfile, setAccessToken } = profileStore();

  const [fileList, setFileList] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const onFinish = async (values) => {
    //console.log(values);
    // const param = {
    //   email: values.username,   //json data
    //   password: values.password,
    // };
    //send data is form data
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("type", null);
    //jab image jenh pi form
    if (values.image && values.image.file && values.image.file.originFileObj) {
      formData.append("image", values.image.file.originFileObj);
    }
    const res = await request("register", "post", formData);
    if (res && !res.errors) {
      // setProfile(res.user);
      // setAccessToken(res.access_token);
      message.success("Create account successfull");
      navigate("/login");
    } else {
      // message.error("Create account fails");
      setErrors(res.errors);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <div
      style={{
        width: 350,
        // height: 400,
        border: "1px solid #eee",
        backgroundColor: "#eee",
        padding: 25,
        margin: "auto",
        marginTop: 35,
        borderRadius: 10,
      }}
    >
      <h2 style={{ marginBottom: 10, paddingTop: 10 }}>New Account</h2>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your Name!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
          {...errors?.email}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
          {...errors?.password}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          rules={[
            { required: true, message: "Please input your confirm Password!" },
          ]}
          {...errors?.password_confirmation}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="confirm Password"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          // rules={[
          //   { required: true, message: "Please input your confirm Password!" },
          // ]}
        >
          <Input prefix={<PhoneFilled />} placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          name="address"
          // rules={[
          //   { required: true, message: "Please input your confirm Password!" },
          // ]}
        >
          <Input.TextArea
            //prefix={<PhoneFilled />}
            placeholder="Address"
          />
        </Form.Item>

        <Form.Item name="image">
          <Upload
            //action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            customRequest={(e) => {
              e.onSuccess();
            }}
            listType="picture-circle"
            fileList={fileList}
            // fileList={fileList}
            // onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length == 1 ? null : uploadButton}
          </Upload>

          {/* <Upload
            listType="picture-circle"
            //fileList={fileList} // ✅ ត្រូវមាន
            //onChange={({ fileList: newFileList }) => setFileList(newFileList)} // ✅ ត្រូវមាន
          >
            {fileList.length === 1 ? null : uploadButton}
          </Upload> */}
        </Form.Item>
        {/* <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </Flex>
        </Form.Item> */}

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
          or <a href="/login">Login with existing</a>
        </Form.Item>
      </Form>
    </div>
  );
};
export default RegisterPage;
