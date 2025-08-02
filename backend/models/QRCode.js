const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    amount:{
        type:Number,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['active', 'used', 'expired'],
        default: 'active'
    },
    expiresAt:{
        type: Date,
        default:()=> new Date(+new Date() +24*60*60*1000) // 24 hours from creation
    },
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        default:null
    }
}, {
    timestamps:true
});

// Add index for faster queries
qrCodeSchema.index({ userId: 1, status: 1 });
qrCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('QRCode', qrCodeSchema); 