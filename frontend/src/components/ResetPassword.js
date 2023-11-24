// src/components/ResetPassword.js
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { sendPasswordResetEmail } from '../Services/auth';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await sendPasswordResetEmail(values.email);
      console.log(response.data); // Handle success message
    } catch (error) {
      console.error(error.response.data.message); // Handle error messages
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPassword;
