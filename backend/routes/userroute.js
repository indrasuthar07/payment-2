const router = require('express').Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/profile', authMiddleware, async(req,res)=>{
    try{
        const user = await User.findById(req.user.userId).select('-password');
        if(!user){
            return res.status(404).json({ message:'User not found'});
        }
        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNo: user.mobileNo,
            balance: user.balance,
            createdAt: user.createdAt
        });
    }catch(error) {
        res.status(500).json({message:'Server error'});
    }
});

// Update user profile
router.put('/profile',authMiddleware, async(req,res)=>{
    try{
        const {firstName,lastName, mobileNo} = req.body;
        const user = await User.findById(req.user.userId);
        
        if(!user){
            return res.status(404).json({ message:'User not found'});
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (mobileNo) user.mobileNo = mobileNo;

        await user.save();
        res.json({ message: 'Profile updated successfully',user});
    }catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password
router.put('/change-password',authMiddleware,async (req,res)=>{
    try{
        const{currentPassword,newPassword} = req.body;
        const user = await User.findById(req.user.userId);

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch= await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            return res.status(400).json({ message:'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    }catch(error) {
        res.status(500).json({message:'Server error'});
    }
});

// Get user balance
router.get('/balance',authMiddleware,async (req,res)=>{
    try{
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ balance: user.balance });
    }catch(error){
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify account number
router.post('/verify-account', authMiddleware,async (req,res)=>{
    try{
        const{accountNumber} = req.body;
        
        // Find user by account number objectid
        const user = await User.findById(accountNumber).select('-password');
        
        if(!user){
            return res.status(404).json({ 
                success: false,
                message: 'Account not found' 
            });
        }

        // not self-transfer
        if(user._id.toString()=== req.user.userId) {
            return res.status(400).json({
                success: false,
                message:'Cannot transfer to your own account'
            });
        }

        res.json({
            success:true,
            message:'Account verified successfully',
            user:{
                _id: user._id,
                firstName:user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    }catch(error){
        console.error('Account verification error:',error);
        res.status(500).json({ 
            success:false,
            message:'Error verifying account' 
        });
    }
});

// Get current user
router.get('/me', authMiddleware, async(req, res)=>{
    try{
        const user = await User.findById(req.user.userId).select('-password');
        if(!user){
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        res.json({ 
            success: true,
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobileNo: user.mobileNo,
                balance: user.balance || 0,
                createdAt: user.createdAt
            }
        });
    }catch (error){
        console.error('Error fetching user:',error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

module.exports = router;
