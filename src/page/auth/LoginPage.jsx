import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Spin } from "antd";
import { useNavigate } from "react-router-dom";
//import {create} from "zustand";
import { profileStore } from "../../store/profileStore";
// import { setAccessToken } from "../../Store/profileStore";
import { request } from "../../utill/request";

const LoginPage = () => {
  const { setProfile, setAccessToken, setPermission } = profileStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    // console.log('Received values of form: ', values);
    // alert(JSON.stringify(values))
    // values.username
    // values.password check in serve
    const param = {
      email: values.username,
      password: values.password,
    };
    setLoading(true);
    //alert(JSON.stringify(param))
    const res = await request("login", "post", param);
    //console.log(res);
    setLoading(false);
    if (res && !res.error) {
      //alert(JSON.stringify(res))
      //setProfile(res.user);  // step 1
      setProfile({
        //extract pic step 2
        ...res.user?.profile,
        ...res.user,
      });
      setAccessToken(res.access_token);
      setPermission(res.permission);
      navigate("/");
    }

    // let issuccess = true;
    // if(issuccess){
    //   const profile = {
    //     id: 1,
    //     name : "kilin Toch",
    //     email: values.username,
    //     role : "IT Manager",
    //   }
    //   setProfile(profile);
    //   navigate("/");

    // }
  };
  return (
    <Spin spinning={loading}>
      <div
        style={{
          width: 350,
          height: 400,
          border: "1px solid #eee",
          backgroundColor: "#eee",
          padding: 25,
          margin: "auto",
          marginTop: 35,
          borderRadius: 10,
        }}
      >
        <h1 style={{ marginBottom: 10, paddingTop: 10 }}>Login Form</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            or <a href="/register">Register now!</a>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};
export default LoginPage;
