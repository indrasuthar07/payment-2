const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// Verify account endpoint
router.get('/verify-account/:accountId',authMiddleware,async (req, res)=>{
    try {
        const user = await User.findById(req.params.accountId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }
        
    
        res.json({
            success: true,
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error){
        console.error('Account verification error:', error);
        res.status(500).json({ success: false, message: 'Error verifying account' });
    }
});

// Get all transactions for a user
router.get('/',authMiddleware, async (req, res)=>{
    try {
        const transactions =await Transaction.find({
            $or: [{ sender:req.user.userId },{ receiver: req.user.userId }]
        })
        .populate('sender', 'firstName lastName email')
        .populate('receiver','firstName lastName email')
        .sort({ createdAt: -1 });
        res.json({ success: true,transactions});
    } catch (error) {
        console.error('Error fetching transactions:',error);
        res.status(500).json({ success:false, message:'Error fetching transactions' });
    }
});

// Deposit money
router.post('/deposit',authMiddleware,async (req, res)=>{
    try{
        const{amount, description,paymentMethod} =req.body;

        if(!amount ||amount<= 0){
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        if(amount >5000){
            return res.status(400).json({ success:false, message:'Maximum deposit amount is 5000' });
        }

        if(!paymentMethod){
            return res.status(400).json({ success:false, message:'Payment method is required' });
        }

        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(404).json({ success:false, message:'User not found' });
        }

        const transaction =new Transaction({
            type: 'deposit',
            amount:parseFloat(amount),
            description,
            paymentMethod,
            receiver: req.user.userId,
            status:'completed'
        });

        user.balance =(user.balance ||0) +parseFloat(amount);

        await transaction.save();
        await user.save();

        res.json({
            success: true,
            message: 'Money added successfully',
            transaction,
            newBalance: user.balance
        });
    }catch (error){
        console.error('Deposit error:', error);
        res.status(500).json({success: false,message:'Error processing deposit: '+ error.message });
    }
});

// Transfer money
router.post('/transfer',authMiddleware,async (req,res)=>{
    try{
        const {receiverId, amount,description}= req.body;

        // Validate input
        if(!receiverId ||!amount ||!description){
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: receiverId, amount, and description are required' 
            });
        }

        if(amount <=0){
            return res.status(400).json({success:false,message: 'Amount must be greater than 0' });
        }

        // Get sender and receiver
        const sender = await User.findById(req.user.userId);
        const receiver = await User.findById(receiverId);

        if(!sender){
            return res.status(404).json({success:false,message: 'Sender not found'});
        }

        if(!receiver){
            return res.status(404).json({success:false, message:'Receiver not found'});
        }

        // Check if sender has sufficient balance
        if(!sender.balance ||sender.balance <amount){
            return res.status(400).json({ success:false,message: 'Insufficient balance'});
        }

        // Prevent self-transfer
        if(sender._id.toString()===receiver._id.toString()) {
            return res.status(400).json({success:false,message:'Cannot transfer to your own account'});
        }

        // Create transaction
        const transaction = new Transaction({
            type: 'transfer',
            amount: parseFloat(amount),
            description,
            sender: req.user.userId,
            receiver: receiverId,
            status: 'completed'
        });

        // Update balances
        sender.balance =parseFloat(sender.balance)- parseFloat(amount);
        receiver.balance = parseFloat(receiver.balance|| 0) +parseFloat(amount);

        // Save all changes
        await Promise.all([
            transaction.save(),
            sender.save(),
            receiver.save()
        ]);

        res.json({
            success: true,
            message: 'Transfer successful',
            transaction,
            newBalance: sender.balance
        });
    }catch (error){
        console.error('Transfer error:', error);
        res.status(500).json({ 
            success: false, 
            message:'Error processing transfer: '+ error.message 
        });
    }
});

module.exports = router;