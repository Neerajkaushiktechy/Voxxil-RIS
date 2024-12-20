const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    occupation: {
        type: String,
        trim: true,
    },
});


const Master_Occupations = mongoose.model('master_occupations', schema, "master_occupations");
module.exports = Master_Occupations;