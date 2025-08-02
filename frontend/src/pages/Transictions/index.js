import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, TransactionOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, EyeOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransferModal from './TransferModal';
import AddMoneyModal from './AddMoneyModal';

function Transactions() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      message.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        setUserBalance(response.data.user.balance || 0);
      }
    } catch (error) {
      message.error('Failed to fetch user balance');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchTransactions();
    fetchUserBalance();
  }, [user, navigate]);

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
          <span className="text-3xl font-bold text-blue-600 mb-2">Please sign in to view your transactions</span>
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

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => (
        <span className="font-mono text-blue-500 hover:text-blue-400 cursor-pointer">{text}</span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex flex-col">
          <span className="text-gray-700">{new Date(date).toLocaleDateString()}</span>
          <span className="text-gray-400 text-xs">{new Date(date).toLocaleTimeString()}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{type.toUpperCase()}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <div className="flex items-center gap-2">
          <DollarOutlined className={amount > 0 ? 'text-green-500' : 'text-red-500'} />
          <span className={`font-bold ${amount > 0 ? 'text-green-500' : 'text-red-500'}`}>${Math.abs(amount).toFixed(2)}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
          pending: { color: 'gold', icon: <span className="animate-pulse">Pending</span>, text: 'Pending' },
          failed: { color: 'red', icon: <CloseCircleOutlined />, text: 'Failed' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge color={config.color} text={<span>{config.icon} {config.text}</span>} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => message.info('View details coming soon')}
        />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen py-6 px-2 sm:px-6 md:px-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center">
  <div className="glass-card w-full max-w-5xl mx-auto p-4 sm:p-8 shadow-2xl mb-8 flex flex-col items-center">
    <h2 className="text-xl sm:text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
      <TransactionOutlined /> Transactions
    </h2>
    <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
      View your latest transactions and track spending
    </p>

    {/* Stats Cards */}
    <div className="w-full grid grid-cols-3 gap-3 sm:gap-6 mb-6">
      <div className="glass-card p-3 flex flex-col sm:p-6 items-center shadow-lg bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl">
        <span className="text-[8px] font-bold sm:text-lg text-blue-400 mb-1">Total Balance</span>
        <span className="text-xs sm:text-2xl font-bold text-blue-400">${userBalance}</span>
      </div>
      <div className="glass-card p-3 sm:p-6 flex flex-col items-center shadow-lg bg-gradient-to-br from-green-500 to-green-300 rounded-xl">
        <span className="text-[8px] font-bold sm:text-lg text-green-400 mb-1">Total Income</span>
        <span className="text-xs sm:text-2xl font-bold text-green-400">$0</span>
      </div>
      <div className="glass-card p-3 sm:p-6 flex flex-col items-center shadow-lg bg-gradient-to-br from-red-500 to-red-300 rounded-xl">
        <span className="text-[8px] font-bold sm:text-lg text-red-400 mb-1">Total Expense</span>
        <span className="text-xs sm:text-2xl font-bold text-red-400">$0</span>
      </div>
    </div>

    {/* Header & Actions */}
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
      <span className="text-lg sm:text-xl font-semibold text-blue-700">Transaction History</span>
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap w-full sm:w-auto">
        <button
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-lg hover:from-green-600 hover:to-green-500 transition-all"
          onClick={() => setShowAddMoneyModal(true)}
        >
          <PlusOutlined className="mr-1 sm:mr-2" /> Add Money
        </button>
        <button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all"
          onClick={() => setShowTransferModal(true)}
        >
          <SwapOutlined className="mr-1 sm:mr-2" /> Transfer
        </button>
      </div>
    </div>

    {/* Responsive Table */}
    <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
        className="wallet-table text-[10px] sm:text-xs md:text-sm"
      />
    </div>
  </div>

  {/* Modals */}
  <AddMoneyModal
    showAddMoneyModal={showAddMoneyModal}
    setShowAddMoneyModal={setShowAddMoneyModal}
    reloadData={fetchTransactions}
  />
  <TransferModal
    showTransferModal={showTransferModal}
    setShowTransferModal={setShowTransferModal}
    reloadData={fetchTransactions}
  />
</div>

  );
}

export default Transactions;
