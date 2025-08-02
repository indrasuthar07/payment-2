import React, { useState } from 'react';
import { QrcodeOutlined, CameraOutlined } from '@ant-design/icons';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import QRCodeScanner from '../../components/QRCodeScanner';

const tabList = [
  {
    key: 'generate',
    label: (
      <span className="flex items-center gap-2 text-lg font-semibold">
        <QrcodeOutlined /> Generate QR Code
      </span>
    ),
  },
  {
    key: 'scan',
    label: (
      <span className="flex items-center gap-2 text-lg font-semibold">
        <CameraOutlined /> Scan QR Code
      </span>
    ),
  },
];

function QRCodePage() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="w-full min-h-screen py-8 px-2 sm:px-6 md:px-12 bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col items-center">
      <div className="glass-card w-full max-w-2xl mx-auto p-8 shadow-2xl mb-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center  text-blue-700 mb-2">QR Code Payments</h2>
        <p className="text-gray-600 mb-6 text-center">Generate or scan QR codes to send and receive payments instantly.</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 w-full justify-center">
  {tabList.map(tab => (
    <button
      key={tab.key}
      className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm shadow-md ${
        activeTab === tab.key
          ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
      onClick={() => setActiveTab(tab.key)}
    >
      {tab.label}
    </button>
  ))}
</div>

        <div className="w-full flex flex-col items-center">
          {activeTab === 'generate' && (
            <div className="w-full flex flex-col items-center">
              <QRCodeGenerator />
            </div>
          )}
          {activeTab === 'scan' && (
            <div className="w-full flex flex-col items-center">
              <QRCodeScanner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRCodePage; 