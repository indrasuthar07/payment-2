import React, { useState } from 'react';
import { Card, Input, Button, Form, message, Modal, Typography, Space } from 'antd';
import { QrcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const { Title, Text } = Typography;

function QRCodeGenerator() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const generateQR = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/qrcode/generate', {
                amount: parseFloat(values.amount),
                description: values.description
            });

            if (response.data.success) {
                setQrData(response.data.qrCode);
                setIsModalVisible(true);
                message.success('QR code generated successfully');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Error generating QR code');
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById('qr-code');
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `payment-qr-${qrData.qrId}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <>
            <Card className="bg-white shadow-lg">
                <Title level={4} className="mb-4">Generate Payment QR Code</Title>
                <Form
                    form={form}
                    onFinish={generateQR}
                    layout="vertical"
                >
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[
                            { required: true, message: 'Please enter amount' },
                            { type: 'number', transform: (value) => Number(value), message: 'Amount must be a number' },
                          
                        ]}
                    >
                        <Input
                            type="number"
                            prefix="$"
                            placeholder="Enter amount"
                            step="0.01"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <Input placeholder="Enter payment description" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            icon={<QrcodeOutlined />}
                            loading={loading}
                            htmlType="submit"
                            block
                        >
                            Generate QR Code
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="Payment QR Code"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={downloadQR}>
                        Download QR Code
                    </Button>,
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                {qrData && (
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg mb-4">
                            <QRCodeCanvas
                                id="qr-code"
                                value={`${window.location.origin}/pay/${qrData.qrId}`}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <Space direction="vertical" align="center">
                            <Text strong>Amount: ${qrData.amount}</Text>
                            <Text type="secondary">{qrData.description}</Text>
                            <Text type="secondary" className="text-xs">
                                Expires: {new Date(qrData.expiresAt).toLocaleString()}
                            </Text>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default QRCodeGenerator; 