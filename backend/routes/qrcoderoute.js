const router = require('express').Router();
const QRCode = require('../models/QRCode');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Generate a new QR code for payment
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const { amount, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid amount' 
            });
        }

        // Create new QR code
        const qrCode = new QRCode({
            userId: req.user.userId,
            amount: parseFloat(amount),
            description: description || 'QR Code Payment'
        });

        await qrCode.save();

        // Generate QR code data
        const qrData ={
            qrId: qrCode._id,
            amount: qrCode.amount,
            description: qrCode.description,
            expiresAt: qrCode.expiresAt
        };

        res.json({
            success: true,
            message: 'QR code generated successfully',
            qrCode: qrData
        });
    } catch (error){
        console.error('QR code generation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating QR code' 
        });
    }
});

// Get QR code details
router.get('/:qrId', authMiddleware, async (req, res)=>{
    try{
        const qrCode = await QRCode.findById(req.params.qrId)
            .populate('userId', 'firstName lastName email');

        if(!qrCode){
            return res.status(404).json({ 
                success: false, 
                message: 'QR code not found' 
            });
        }

        if(qrCode.status !== 'active'){
            return res.status(400).json({ 
                success: false, 
                message: 'QR code is no longer active' 
            });
        }

        if(qrCode.expiresAt < new Date()){
            qrCode.status = 'expired';
            await qrCode.save();
            return res.status(400).json({ 
                success: false, 
                message: 'QR code has expired' 
            });
        }

        res.json({
            success: true,
            qrCode:{
                id: qrCode._id,
                amount: qrCode.amount,
                description: qrCode.description,
                merchant: {
                    name: `${qrCode.userId.firstName} ${qrCode.userId.lastName}`,
                    email: qrCode.userId.email
                },
                expiresAt: qrCode.expiresAt
            }
        });
    }catch (error){
        console.error('QR code fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching QR code details' 
        });
    }
});

// Process QR code payment
router.post('/pay/:qrId', authMiddleware, async(req, res)=>{
    try{
        const qrCode = await QRCode.findById(req.params.qrId)
            .populate('userId', 'firstName lastName email balance');

        if(!qrCode){
            return res.status(404).json({ 
                success: false, 
                message: 'QR code not found' 
            });
        }

        if(qrCode.status !== 'active'){
            return res.status(400).json({ 
                success: false, 
                message: 'QR code is no longer active' 
            });
        }

        if(qrCode.expiresAt<new Date()){
            qrCode.status ='expired';
            await qrCode.save();
            return res.status(400).json({ 
                success: false, 
                message:'QR code has expired'
            });
        }

        // Prevent self-payment
        if(qrCode.userId._id.toString()=== req.user.userId){
            return res.status(400).json({ 
                success: false, 
                message:'Cannot pay to your own QR code' 
            });
        }

        // Get payer's details
        const payer =await User.findById(req.user.userId);
        if(!payer){
            return res.status(404).json({ 
                success: false, 
                message:'Payer not found' 
            });
        }

        // Check if payer has sufficient balance
        if(payer.balance< qrCode.amount){
            return res.status(400).json({ 
                success: false, 
                message:'Insufficient balance' 
            });
        }

        // Create transaction
        const transaction =new Transaction({
            type: 'transfer',
            amount:qrCode.amount,
            description:`QR Payment:${qrCode.description}`,
            sender:req.user.userId,
            receiver:qrCode.userId._id,
            status:'completed'
        });

        // Update balances
        payer.balance -=qrCode.amount;
        qrCode.userId.balance =(qrCode.userId.balance || 0)+ qrCode.amount;

        // Update QR code status
        qrCode.status ='used';
        qrCode.paymentId =transaction._id;

        // Save all changes
        await Promise.all([
            transaction.save(),
            payer.save(),
            qrCode.userId.save(),
            qrCode.save()
        ]);

        res.json({
            success: true,
            message:'Payment processed successfully',
            transaction:{
                id: transaction._id,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                newBalance: payer.balance
            }
        });
    }catch (error){
        console.error('QR payment error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing QR payment' 
        });
    }
});

// Get user's QR code history
router.get('/history/me',authMiddleware,async(req, res)=>{
    try {
        const qrCodes =await QRCode.find({ userId: req.user.userId})
            .sort({ createdAt: -1 })
            .populate('paymentId');
        res.json({
            success: true,
            qrCodes: qrCodes.map(qr => ({
                id: qr._id,
                amount: qr.amount,
                description: qr.description,
                status: qr.status,
                createdAt: qr.createdAt,
                expiresAt: qr.expiresAt,
                payment: qr.paymentId ? {
                    id: qr.paymentId._id,
                    amount: qr.paymentId.amount,
                    status: qr.paymentId.status,
                    createdAt: qr.paymentId.createdAt
                }:null
            }))
        });
    }catch(error){
        console.error('QR history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching QR code history' 
        });
    }
});

module.exports = router; 