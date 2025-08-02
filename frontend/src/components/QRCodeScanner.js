import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Typography, Space, message, Spin } from 'antd';
import { QrcodeOutlined, CameraOutlined } from '@ant-design/icons';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function QRCodeScanner() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let scanner = null;

        if (scanning) {
            scanner = new Html5QrcodeScanner('qr-reader', {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });

            scanner.render(handleScan, handleError);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error('Failed to clear scanner', error);
                });
            }
        };
    }, [scanning]);

    const handleScan = async (decodedText) => {
        try {
            // Extract QR ID from the URL
            const qrId = decodedText.split('/').pop();
            setLoading(true);
            
            const response = await axios.get(`/api/qrcode/${qrId}`);
            if (response.data.success) {
                setQrData(response.data.qrCode);
                setIsModalVisible(true);
                setScanning(false);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Invalid QR code');
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        console.error('QR Scan Error:', error);
        message.error('Error scanning QR code');
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/qrcode/pay/${qrData.id}`);
            
            if (response.data.success) {
                message.success('Payment processed successfully');
                setIsModalVisible(false);
                navigate('/transactions');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="bg-white shadow-lg">
                <Title level={4} className="mb-4">Scan Payment QR Code</Title>
                <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={() => setScanning(true)}
                    block
                >
                    Scan QR Code
                </Button>
            </Card>

            <Modal
                title="Scan QR Code"
                open={scanning}
                onCancel={() => setScanning(false)}
                footer={null}
                width={400}
            >
                <div className="flex flex-col items-center">
                    <div id="qr-reader" className="w-full max-w-sm"></div>
                    <Text className="mt-4 text-center text-gray-600">
                        Position the QR code within the frame to scan
                    </Text>
                </div>
            </Modal>

            <Modal
                title="Payment Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="pay"
                        type="primary"
                        loading={loading}
                        onClick={handlePayment}
                    >
                        Pay ${qrData?.amount}
                    </Button>
                ]}
            >
                {qrData && (
                    <Spin spinning={loading}>
                        <Space direction="vertical" className="w-full">
                            <div className="flex justify-between">
                                <Text>Amount:</Text>
                                <Text strong>${qrData.amount}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text>Description:</Text>
                                <Text>{qrData.description}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text>Merchant:</Text>
                                <Text>{qrData.merchant.name}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text>Expires:</Text>
                                <Text>{new Date(qrData.expiresAt).toLocaleString()}</Text>
                            </div>
                        </Space>
                    </Spin>
                )}
            </Modal>
        </>
    );
}

export default QRCodeScanner; 