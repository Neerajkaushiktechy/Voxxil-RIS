const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        require
    },
    companyName: {
        type: String,
        trim: true,
        // require
    },
    email: {
        type: String,
        trim: true,
        require
    },
});


const Enquiry = mongoose.model('enquiry', schema);
module.exports = Enquiry;