import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-6">
      <Card
        className="w-full max-w-[440px] !rounded-xl !shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-8 px-4"
        bordered={false}
      >
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Able Logo" className="max-w-[200px] h-auto" />
        </div>

        <Title
          level={3}
          className="!text-center !mb-10 text-[#262626] font-semibold"
        >
          Login
        </Title>

        <Form
          name="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          className="w-full [&_.ant-form-item-label_label]:!text-[#262626] [&_.ant-form-item-label_label]:!font-medium [&_.ant-form-item-explain-error]:!text-[13px] [&_.ant-form-item-explain-error]:!mt-1"
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
            label="Email"
            name="username"
            rules={[{ required: true, message: 'Please input your email' }]}
          >
            <Input
              placeholder="Enter Email"
              className="!rounded-[6px] px-3 py-2 hover:!border-[#40a9ff] focus:!border-[#40a9ff]"
            />
          </Form.Item>

          <Form.Item
            label="Password :"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder=""
              className="!rounded-[6px] px-3 py-2 hover:!border-[#40a9ff] focus:!border-[#40a9ff]"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="!h-[44px] !rounded-[22px] !bg-[#597ef7] !border-[#597ef7] !text-base mt-3 hover:!bg-[#2f54eb] hover:!border-[#2f54eb] focus:!bg-[#2f54eb] focus:!border-[#2f54eb]"
              block
              loading={submitting}
            >
              Submit
            </Button>
          </Form.Item>

          <div className="text-center mt-8">
            <a
              href="/forgot-password"
              className="!text-sm !text-[#1890ff] transition-colors duration-300 hover:!text-[#40a9ff]"
            >
              Forgot Password ?
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
