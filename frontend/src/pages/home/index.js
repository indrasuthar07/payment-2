import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Typography, message, Timeline, Tooltip } from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, TransactionOutlined,
  CreditCardOutlined, BankOutlined, BellOutlined, ThunderboltOutlined, DollarOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TransferModal from '../Transictions/TransferModal';
import AddMoneyModal from '../Transictions/AddMoneyModal';
import axios from 'axios';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Home = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0
  });
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUserBalance = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.user) {
        setQuickStats(prev => ({
          ...prev,
          totalBalance: response.data.user.balance || 0,
          monthlyIncome: 15500,
          monthlyExpense: 7000
        }));
      }
    } catch {
      message.error('Failed to fetch user balance');
    }
  };

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch {
      message.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBalance();
      fetchTransactions();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-2">Welcome!</span>
          <span className="text-lg text-gray-500 mb-6">Sign in to access your wallet dashboard</span>
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: <WalletOutlined />, title: 'Add Money', onClick: () => setShowAddMoneyModal(true), color: 'bg-green-500' },
    { icon: <TransactionOutlined />, title: 'Send Money', onClick: () => setShowTransferModal(true), color: 'bg-blue-500' },
    { icon: <CreditCardOutlined />, title: 'Link Card', onClick: () => navigate('/link-card'), color: 'bg-purple-500' },
    { icon: <BankOutlined />, title: 'Link Bank', onClick: () => navigate('/link-bank'), color: 'bg-pink-500' }
  ];

  return (
    <div className="relative w-full py-6 px-4 sm:px-8 md:px-16 space-y-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen text-gray-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <DollarOutlined
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              color: 'rgba(0,0,0,0.05)',
              animation: `float ${10 + Math.random() * 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { transform: translateY(-30px); opacity: 0.3; }
          100% { transform: translateY(0); opacity: 0.1; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-white shadow-xl rounded-2xl border border-gray-100 relative z-10">
        <div>
          <span className="block text-2xl font-bold text-blue-700 mb-1">{greeting()}, {user?.firstName}! 👋</span>
          <span className="block text-gray-500 text-lg">Here’s your wallet overview.</span>
        </div>
        <Badge count={3} offset={[-5, 5]}>
          <Button type="primary" shape="round" icon={<BellOutlined />} size="large" className="bg-blue-500 hover:bg-blue-600 border-none shadow-md">
            Notifications
          </Button>
        </Badge>
      </div>

      {/* Quick Stats */}
     <Row gutter={[16, 16]} justify="center" align="middle">
  <Col xs={12} md={6}>
    {/* Total Balance */}
    <Card className="relative rounded-lg bg-white shadow-md border border-gray-100 text-center hover:shadow-xl transition-all p-2 sm:p-6">
      <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-30 z-0"></div>
      <div className="relative z-10">
        <Text className="text-xs font-bold sm:text-lg text-gray-500">Total User Balance</Text>
        <Title level={2} className="!text-xs !font-bold sm:!text-2xl !text-blue-600 mt-1 sm:mt-2">
          <CountUp end={user?.balance || 0} duration={2} separator="," prefix="$" />
        </Title>
      </div>
    </Card>
  </Col>

  <Col xs={12} md={6}>
    {/* Monthly Income */}
    <Card className="relative rounded-lg bg-white shadow-md border border-gray-100 text-center hover:shadow-xl transition-all p-2 sm:p-6">
      <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-200 to-green-400 rounded-full opacity-30 z-0"></div>
      <div className="relative z-10">
        <Text className="text-xs font-bold sm:text-lg text-gray-500">Monthly Income</Text>
        <Title level={2} className="!text-xs !font-bold sm:!text-2xl !text-green-500 mt-1 sm:mt-2">
          <CountUp end={15000} duration={2} separator="," prefix="$" />
        </Title>
      </div>
    </Card>
  </Col>

  <Col xs={12} md={6}>
    {/* Monthly Expense */}
    <Card className="relative rounded-lg bg-white shadow-md border border-gray-100 text-center hover:shadow-xl transition-all p-2 sm:p-6">
      <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-red-200 to-red-400 rounded-full opacity-30 z-0"></div>
      <div className="relative z-10">
        <Text className="text-xs font-bold sm:text-lg text-gray-500">Monthly Expense</Text>
        <Title level={2} className="!text-xs !font-bold sm:!text-2xl !text-red-500 mt-1 sm:mt-2">
          <CountUp end={7000} duration={2} separator="," prefix="$" />
        </Title>
      </div>
    </Card>
  </Col>

  <Col xs={12} md={6}>
    {/* Savings Rate */}
    <Card className="relative rounded-lg bg-white shadow-md border border-gray-100 text-center hover:shadow-xl transition-all p-2 sm:p-6">
      <div className="absolute -top-4 -right-4 w-16
       h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-200 to-green-400 rounded-full opacity-30 z-0"></div>
      <div className="relative z-10">
        <Text className="text-xs font-bold sm:text-lg text-gray-500">Savings Rate</Text>
        <div className="relative sm:my-4 w-16 h-16 sm:w-20 sm:h-20">
          <svg className="transform -rotate-90 w-16 h-16 sm:w-20 sm:h-20">
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="24"
              stroke="currentColor"
              strokeWidth="6"
              className="text-green-500"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - 0.65)}`} // 65%
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-xl font-bold text-green-600">
            65%
          </span>
        </div>
      </div>
    </Card>
  </Col>
</Row>




      {/* Quick Actions */}
      <Card title={<span className="text-blue-600 text-xl font-semibold md:text-2xl "><ThunderboltOutlined /> Quick Actions</span>} className="rounded-xl bg-white shadow-lg border border-gray-100">
        <Row gutter={[16, 16]} justify="center">
          {quickActions.map((action, i) => (
            <Col xs={12} sm={6} key={i} className="flex text-sm flex-col items-center md:text-xl">
              <Tooltip title={action.title}>
                <Button
                  shape="circle"
                  size="large"
                  icon={action.icon}
                  onClick={action.onClick}
                  className={`${action.color} hover:scale-110 transform transition-transform shadow-lg text-white`}
                />
              </Tooltip>
              <span className="mt-2 text-gray-600 font-medium">{action.title}</span>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Recent Transactions */}
      <Card
  className="rounded-2xl shadow-xl bg-white backdrop-blur-lg border-none p-6"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-blue-700">Transactions</h2>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between w-full">
  <Button
    type="primary"
    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 rounded-lg shadow-md text-sm sm:text-base"
    onClick={() => setShowAddMoneyModal(true)}
  >
    + Add Money
  </Button>
  <Button
    type="primary"
    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md text-sm sm:text-base"
    onClick={() => setShowTransferModal(true)}
  >
    Transfer
  </Button>
</div>

  </div>

  <div className="overflow-x-auto">
  <table className="w-full text-[10px] sm:text-xs md:text-sm text-left text-gray-600">
    <thead>
      <tr className="bg-gray-100 text-gray-800">
        <th className="px-2 sm:px-4 py-2 rounded-tl-lg">Transaction ID</th>
        <th className="px-2 sm:px-4 py-2">Date & Time</th>
        <th className="px-2 sm:px-4 py-2">Type</th>
        <th className="px-2 sm:px-4 py-2">Amount</th>
        <th className="px-2 sm:px-4 py-2">Status</th>
        <th className="px-2 sm:px-4 py-2 rounded-tr-lg">Actions</th>
      </tr>
    </thead>
    <tbody>
      {transactions.slice(0, 5).map((t, index) => (
        <tr
          key={t._id || index}
          className="border-b hover:bg-gray-50 transition"
        >
          <td className="px-2 sm:px-4 py-2 text-blue-600 font-medium break-words">
            {t._id}
          </td>
          <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
            {new Date(t.createdAt).toLocaleString()}
          </td>
          <td className="px-2 sm:px-4 py-2">
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                t.type === "deposit"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {t.type.toUpperCase()}
            </span>
          </td>
          <td
            className={`px-2 sm:px-4 py-2 font-bold ${
              t.type === "deposit" ? "text-green-500" : "text-red-500"
            }`}
          >
            {t.type === "deposit" ? "+" : "-"}${t.amount.toFixed(2)}
          </td>
          <td className="px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 text-green-600">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            Completed
          </td>
          <td className="px-2 sm:px-4 py-2">
            <Button
              type="link"
              className="text-blue-500 hover:text-blue-700 text-[10px] sm:text-xs"
            >
              View
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</Card>

      {/* Modals */}
      <TransferModal showTransferModal={showTransferModal} setShowTransferModal={setShowTransferModal} reloadData={fetchTransactions} />
      <AddMoneyModal showAddMoneyModal={showAddMoneyModal} setShowAddMoneyModal={setShowAddMoneyModal} reloadData={fetchTransactions} />
    </div>
  );
};

export default Home;
