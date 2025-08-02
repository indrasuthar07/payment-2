import React from 'react';
import { HomeOutlined, TransactionOutlined, QrcodeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'home', icon: <HomeOutlined />, label: 'Home', path: '/home' },
  { key: 'transactions', icon: <TransactionOutlined />, label: 'Transactions', path: '/transactions' },
  { key: 'qrcode', icon: <QrcodeOutlined />, label: 'QR', path: '/qrcode' },
  { key: 'profile', icon: <UserOutlined />, label: 'Profile', path: '/profile' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
];

function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-blue-700 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-2 z-50 md:hidden shadow-2xl">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs font-semibold px-2 focus:outline-none transition-all ${isActive ? 'text-blue-200' : 'text-white/80 hover:text-blue-200'}`}
          >
            <span className={`text-xl mb-0.5 ${isActive ? 'drop-shadow-lg' : ''}`}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav; 