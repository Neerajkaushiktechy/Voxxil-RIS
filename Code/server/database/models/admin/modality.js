const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    term: {
        type: String,
        trim: true,
        require
    },
    decription: {
        type: String,
        trim: true,
        require
    },
    isDeleted: {
        type: Boolean,
        trim: true,
        dafault: false
    },
});


const Modality = mongoose.model('modality', schema);
module.exports = Modality;