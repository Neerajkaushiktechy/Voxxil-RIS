const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
  avatar : {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName :{
    type: String,
    trim: true 
  },
  name: { 
    type: String, 
    trim: true 
  },
  email: {
    type: String,
    trim: true 
  },
  phone : {
    type: String,
    trim: true 
  },
  gender : {
    type: String,
    trim: true 
  },
  dob : {
    type: Date,
    trim: true 
  },
  country :{
    type: String,
    trim: true 
  },
  state :{
    type: String,
    trim: true 
  },
  city :{
    type: String,
    trim: true 
  },
  zipCode :{
    type: String,
    trim: true 
  },
  taxId :{
    type: String,
    trim: true 
  },
  signaturePin :{
    type: String,
    trim: true ,
    default:null
  },
  signatureImage :{
    type: String,
    trim: true 
  },
  password: {
    type: String, 
    required: true,
    trim: true
  }, 
  role: {
    type: String,
    default: "user",
    trim: true
  },
  branchId: {
    type: mongoose.Types.ObjectId,
    trim: true
  },
  isDeleted : {
    type: Boolean,
    trim: true,
    default: false
},
  createdBy: {
    type: mongoose.Types.ObjectId,
    trim: true
  }
});


schema.pre("save", async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hash = await bcrypt.hash(this.password, Number(process.env.BCRYPT_HASH));
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});



// Create the User model based on the schema
const User = mongoose.model('user', schema);
module.exports = User;