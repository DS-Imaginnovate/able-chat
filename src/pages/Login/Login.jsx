import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/able-logo.png';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      await login(values.username, values.password);
      message.success('Login successful');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail?.message ||
        error?.response?.data?.detail?.detail ||
        error?.response?.data?.detail ||
        error?.message ||
        'Login failed';

      message.error(String(errorMessage));
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-logo-container">
          <img src={logo} alt="Able Logo" className="login-logo" />
        </div>
        
        <Title level={3} className="login-title">Login</Title>
        
        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={(label, { required }) => (
            <>
              {required && <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>}
              {label}
            </>
          )}
        >
          <Form.Item
            label="Email or Mobile number:"
            name="username"
            rules={[{ required: true, message: 'Please input your email or mobile number!' }]}
          >
            <Input 
              placeholder="Enter Email or Mobile Number" 
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            label="Password :"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder=""
              className="login-input"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-submit-button"
              block
              loading={submitting}
            >
              Submit
            </Button>
          </Form.Item>

          <div className="login-footer">
            <a href="/forgot-password" style={{ color: '#1890ff' }}>Forgot Password ?</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
