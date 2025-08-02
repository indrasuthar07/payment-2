const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: ['deposit','transfer','withdrawal'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
        validate:{
            validator: function(value){
                if (this.type === 'deposit'){
                    return value <= 5000;
                }
                return true;
            },
            message: 'Maximum deposit amount is 5000'
        }
    },
    description:{
        type: String,
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.type ==='transfer';
        }
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.type ==='transfer'|| this.type === 'deposit';
        }
    },
    paymentMethod:{
        type: String,
        enum: ['card', 'bank', 'upi'],
        required: function(){
            return this.type ==='deposit';
        }
    },
    status:{
        type: String,
        enum: ['pending','completed','failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema); 