import React, { useState } from 'react';
import { login } from '../Services/auth';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await login(values);
      console.log(response.data); // Handle the token or user data as needed
    } catch (error) {
      console.error(error.response.data.message); // Handle error messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
