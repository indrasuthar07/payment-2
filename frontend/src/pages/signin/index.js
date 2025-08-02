import { Button, Input, Form, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/login', {
        email: values.email,
        password: values.password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(SetUser(response.data.user));
        message.success('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="glass-card w-full max-w-md mx-auto p-8 shadow-2xl flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2">
            <h1 className="text-3xl font-bold text-blue-700">Welcome</h1>
            <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors">Back</h1>
          </div>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>
        <Form
          layout="vertical"
          className="space-y-4 w-full"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-blue-600" />}
              placeholder="Email"
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-blue-600" />}
              placeholder="Password"
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-400 border-none hover:from-blue-700 hover:to-blue-500 transition-all duration-300 rounded-lg text-white font-semibold"
          >
            Sign In
          </Button>
        </Form>
        <div className="mt-6 text-center w-full">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;