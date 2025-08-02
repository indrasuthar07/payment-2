import React, { useState } from 'react';
import { Avatar, Button, Badge, message } from 'antd';
import { UserOutlined, WalletOutlined, TransactionOutlined, LogoutOutlined, CreditCardOutlined, BankOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../../redux/UserSlice';

function Profile() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(SetUser(null));
    message.success('Logged out successfully');
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Please sign in to view your profile</span>
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

  return (
    <div className="w-full min-h-screen py-6 px-3 sm:px-6 md:px-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center">
  <div className="glass-card w-full max-w-3xl mx-auto p-6 sm:p-8 shadow-2xl mb-6 sm:mb-8 flex flex-col items-center rounded-xl">
    
    {/* Profile Info */}
    <div className="flex flex-col items-center mb-4 sm:mb-6 text-center">
      <Avatar size={90} icon={<UserOutlined />} className="bg-gradient-to-br from-blue-400 to-blue-700 mb-3 text-white" />
      <span className="text-lg sm:text-2xl font-bold text-blue-800 mb-1">{user?.firstName} {user?.lastName}</span>
      <span className="text-gray-600 text-sm sm:text-base mb-1">{user?.email}</span>
      <span className="text-gray-500 text-xs sm:text-sm mb-1">AC. NO.: {user?.id}</span>
      <Badge status="success" text={<span className="text-green-500 text-xs sm:text-sm">Active Account</span>} />
    </div>

    {/* Stats Cards */}
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <div className="glass-card p-3 sm:p-6 flex flex-col items-center shadow-lg rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white">
        <span className="text-xs text-blue-400 sm:text-lg mb-1">Balance</span>
        <span className="text-sm text-blue-400 sm:text-2xl font-bold">${user?.balance || 0}</span>
      </div>
      <div className="glass-card p-3 sm:p-6 flex flex-col items-center shadow-lg rounded-lg bg-gradient-to-br from-green-500 to-green-300 text-white">
        <span className="text-xs text-blue-400 sm:text-lg mb-1">Transactions</span>
        <span className="text-sm text-blue-400 sm:text-2xl font-bold">{user?.transactions?.length || 0}</span>
      </div>
      <div className="glass-card p-3 sm:p-6 flex flex-col items-center shadow-lg rounded-lg bg-gradient-to-br from-blue-500 to-blue-300 text-white col-span-2 sm:col-span-1">
        <span className="text-xs text-blue-400 sm:text-lg mb-1">Account Level</span>
        <span className="text-sm sm:text-2xl font-bold text-yellow-300">Premium</span>
      </div>
    </div>

    {/* Quick Actions & Recent Transactions */}
    <div className="w-full flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Quick Actions */}
      <div className="flex-1 glass-card p-4 sm:p-6 flex flex-col items-center shadow-lg rounded-lg">
        <span className="text-base sm:text-lg font-bold text-blue-700 mb-3 sm:mb-4">Quick Actions</span>
        <div className="flex flex-col gap-2 sm:gap-3 w-full">
          <button className="flex items-center gap-2 text-green-600 text-xs sm:text-sm font-semibold bg-green-50 hover:bg-green-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all"><WalletOutlined /> Add Money</button>
          <button className="flex items-center gap-2 text-blue-600 text-xs sm:text-sm font-semibold bg-blue-50 hover:bg-blue-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all"><TransactionOutlined /> Send Money</button>
          <button className="flex items-center gap-2 text-purple-600 text-xs sm:text-sm font-semibold bg-purple-50 hover:bg-purple-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all"><CreditCardOutlined /> Link Card</button>
          <button className="flex items-center gap-2 text-yellow-600 text-xs sm:text-sm font-semibold bg-yellow-50 hover:bg-yellow-100 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all"><BankOutlined /> Link Bank</button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex-1 glass-card p-4 sm:p-6 flex flex-col items-center shadow-lg rounded-lg">
        <span className="text-base sm:text-lg font-bold text-blue-700 mb-3 sm:mb-4">Recent Transactions</span>
        <div className="w-full flex flex-col gap-2">
          {(user?.transactions || []).slice(0, 5).map((transaction, idx) => (
            <div key={idx} className="flex justify-between items-center bg-blue-50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
              <span className="font-semibold text-blue-700 text-xs sm:text-sm">{transaction.type}</span>
              <span className="text-gray-500 text-[10px] sm:text-xs">{new Date(transaction.date).toLocaleDateString()}</span>
              <span className={`font-bold text-xs sm:text-sm ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>${Math.abs(transaction.amount).toFixed(2)}</span>
            </div>
          ))}
          {(!user?.transactions || user.transactions.length === 0) && (
            <span className="text-gray-400 text-center text-xs sm:text-sm">No recent transactions</span>
          )}
        </div>
      </div>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all text-sm sm:text-base"
    >
      <LogoutOutlined className="mr-1 sm:mr-2" /> Logout
    </button>
  </div>
</div>

  );
}

export default Profile; 