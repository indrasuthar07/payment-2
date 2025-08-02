const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
    trim: true
  },
  lastName:{
    type:String,
    required: true,
    trim:true
  },
  email:{
    type:String,
    required: true,
    unique:true,
    trim: true,
    lowercase:true
  },
  password:{
    type: String,
    required:true
  },
  dateOfBirth:{
    type:Date,
    required: true
  },
  mobileNo:{
    type:String,
    required: true,
    trim:true
  },
  balance:{
    type:Number,
    default: 0,
    min:0
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('User',userSchema); 