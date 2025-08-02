import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, Button, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { SetUser } from '../../redux/UserSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function Settings() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchUserProfile();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(SetUser(response.data));
    } catch (error) {
      message.error('Failed to load user profile');
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }
      const response = await axios.put('http://localhost:5000/api/users/profile', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(SetUser(response.data.user));
      message.success('Settings updated successfully!');
    } catch (error) {
      message.error('Failed to update settings');
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Please sign in to access settings</span>
          <button
            onClick={() => navigate('/signin')}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabList = [
    { key: 'account', label: 'Account' },
    { key: 'security', label: 'Security' },
    { key: 'preferences', label: 'Preferences' },
  ];

  return (
    <div className="w-full min-h-screen py-8 px-2 sm:px-6 md:px-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center">
      <div className="glass-card w-full max-w-2xl mx-auto p-8 shadow-2xl mb-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2"><SettingOutlined /> Settings</h2>
        <div className="flex gap-4 mb-8 w-full justify-center">
          {tabList.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-xl font-semibold transition-all text-lg shadow-md ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'account' && (
          <Form
            layout="vertical"
            initialValues={{
              email: user?.email,
              mobileNo: user?.mobileNo,
            }}
            onFinish={onFinish}
            className="w-full space-y-6"
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-700">Email Address</span>}
              rules={[{ required: true, type: 'email' }]}
            >
              <Input prefix={<UserOutlined className="text-blue-600" />} className="hover:border-blue-400 focus:border-blue-400" />
            </Form.Item>
            <Form.Item
              name="mobileNo"
              label={<span className="text-gray-700">Phone Number</span>}
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
              ]}
            >
              <Input prefix={<PhoneOutlined className="text-blue-600" />} className="hover:border-blue-400 focus:border-blue-400" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-400 border-none hover:from-blue-700 hover:to-blue-500 transition-all duration-300 rounded-lg text-white font-semibold"
            >
              Save Changes
            </Button>
          </Form>
        )}
        {activeTab === 'security' && (
          <div className="w-full flex flex-col gap-6">
            <div className="glass-card p-6 flex flex-col items-center shadow-lg">
              <span className="text-lg font-bold text-blue-700 mb-4">Two-Factor Authentication</span>
              <Switch className="bg-gray-200" />
            </div>
            <div className="glass-card p-6 flex flex-col items-center shadow-lg">
              <span className="text-lg font-bold text-blue-700 mb-4">Change Password</span>
              <Input.Password prefix={<LockOutlined className="text-blue-600" />} className="hover:border-blue-400 focus:border-blue-400 mb-4" />
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-400 border-none hover:from-blue-700 hover:to-blue-500 transition-all duration-300 rounded-lg text-white font-semibold">Update Password</Button>
            </div>
          </div>
        )}
        {activeTab === 'preferences' && (
          <div className="w-full flex flex-col gap-6">
            <div className="glass-card p-6 flex flex-col items-center shadow-lg">
              <span className="text-lg font-bold text-blue-700 mb-4">Language</span>
              <Select defaultValue="en" className="w-full hover:border-blue-400 focus:border-blue-400">
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
                <Option value="de">German</Option>
                <Option value="zh">Chinese</Option>
              </Select>
            </div>
            <div className="glass-card p-6 flex flex-col items-center shadow-lg">
              <span className="text-lg font-bold text-blue-700 mb-4">Theme</span>
              <Select defaultValue="light" className="w-full hover:border-blue-400 focus:border-blue-400">
                <Option value="dark">Dark</Option>
                <Option value="light">Light</Option>
                <Option value="system">System</Option>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings; 