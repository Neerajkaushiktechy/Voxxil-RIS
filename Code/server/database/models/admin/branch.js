const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require
    },
    branchCode: {
        type: String,
        trim: true,
        require
    },
    email: {
        type: String,
        trim: true,
        require
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    country: {
        type: String,
        trim: true,
        required: true
    },
    branchCode: {
        type: String,
        trim: true,
        required: true
    },
    isDeleted : {
        type: Boolean,
        trim: true,
        default: false
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
});


const Branch = mongoose.model('branch', schema);
module.exports = Branch;