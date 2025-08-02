import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

function AddMoneyModal({ showAddMoneyModal, setShowAddMoneyModal, reloadData }) {
    const [form] = Form.useForm();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        if (!token) {
            message.error('Please sign in to continue');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/transactions/deposit',
                {
                    amount: parseFloat(values.amount),
                    description: values.description,
                    paymentMethod: values.paymentMethod
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                message.success('Money added successfully');
                form.resetFields();
                setShowAddMoneyModal(false);
                if (reloadData) {
                    reloadData();
                }
            } else {
                message.error(response.data.message || 'Error processing deposit');
            }
        } catch (error) {
            console.error('Deposit error:', error);
            message.error(error.response?.data?.message || 'Error processing deposit');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setShowAddMoneyModal(false);
    };

    return (
        <Modal
            title="Add Money"
            open={showAddMoneyModal}
            onCancel={handleClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="paymentMethod"
                    label="Payment Method"
                    rules={[{ required: true, message: 'Please select payment method' }]}
                >
                    <Select placeholder="Select payment method">
                        <Option value="card">Credit/Debit Card</Option>
                        <Option value="bank">Bank Transfer</Option>
                        <Option value="upi">UPI</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                        { required: true, message: 'Please enter amount' },
                        { type: 'number', transform: (value) => Number(value), min: 1, message: 'Amount must be greater than 0' },
                        { 
                            validator: (_, value) => {
                                if (value > 5000) {
                                    return Promise.reject('Maximum deposit amount is 5000');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input type="number" placeholder="Enter amount" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter description' }]}
                >
                    <Input.TextArea placeholder="Enter description" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        Add Money
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddMoneyModal; 