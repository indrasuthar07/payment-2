import { Button, Input, Form, DatePicker, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth.toISOString(),
        mobileNo: values.mobileNo
      });
      if (response.data.message === 'User registered successfully') {
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          dispatch(SetUser(response.data.user));
          message.success('Registration successful!');
          navigate('/home');
        } else {
          message.success('Registration successful! Please login.');
          navigate('/signin');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="glass-card w-full max-w-md mx-auto p-8 shadow-2xl flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2">
            <h1 className="text-3xl font-bold text-blue-700">Create</h1>
            <h1 className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors">Account</h1>
          </div>
          <p className="text-gray-600 mt-2">Join the future of payments</p>
        </div>
        <Form
          layout="vertical"
          className="space-y-4 w-full"
          onFinish={onFinish}
          validateTrigger="onBlur"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please input your first name!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-blue-600" />}
                placeholder="First Name"
                className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please input your last name!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-blue-600" />}
                placeholder="Last Name"
                className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
              />
            </Form.Item>
          </div>
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
            name="mobileNo"
            rules={[
              { required: true, message: 'Please input your mobile number!' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-blue-600" />}
              placeholder="Mobile Number"
              className="bg-blue-50 border-blue-200 text-blue-900 placeholder-blue-400 h-12 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            rules={[{ required: true, message: 'Please select your date of birth!' }]}
          >
            <DatePicker
              className="w-full h-12 bg-blue-50 border-blue-200 text-blue-900 rounded-lg"
              placeholder="Date of Birth"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
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
            Register
          </Button>
        </Form>
        <div className="mt-6 text-center w-full">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;