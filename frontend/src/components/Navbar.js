import React, { useState } from 'react';
import { HomeOutlined, TransactionOutlined, QrcodeOutlined, UserOutlined, SettingOutlined, BellOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { key: 'home', icon: <HomeOutlined />, label: 'Home', path: '/home' },
  { key: 'transactions', icon: <TransactionOutlined />, label: 'Transactions', path: '/transactions' },
  { key: 'qrcode', icon: <QrcodeOutlined />, label: 'QR', path: '/qrcode' },
  { key: 'profile', icon: <UserOutlined />, label: 'Profile', path: '/profile' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-700 shadow-2xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Title */}
        <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/home')}>
          <span className="text-3xl font-extrabold text-blue-300 drop-shadow-lg">₹</span>
          <span className="font-extrabold text-xl tracking-wide text-white/90">PAY-WALLET</span>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 lg:gap-4 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-3 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm border border-transparent ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-white/20' : 'text-white/70 hover:text-blue-200 hover:bg-white/10'}`}
              >
                <span className="text-lg mb-0.5">{item.icon}</span>
                <span className="hidden lg:block mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full bg-white/10 hover:bg-blue-500/30 transition-colors border border-white/10 shadow-md">
            <BellOutlined className="text-xl text-blue-200" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1 shadow">3</span>
          </button>
          {/* Hamburger for mobile */}
          <button className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 border border-white/10" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseOutlined className="text-xl text-white/80" /> : <MenuOutlined className="text-xl text-white/80" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-2 animate-fade-in-down bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900/95 border-t border-white/10 shadow-2xl">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.key}
                onClick={() => { setMenuOpen(false); navigate(item.path); }}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl font-semibold text-base transition-all shadow-sm border border-transparent ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-white/20' : 'text-white/80 hover:text-blue-200 hover:bg-white/10'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default Navbar; 