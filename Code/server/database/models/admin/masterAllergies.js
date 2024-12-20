const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    allergie: {
        type: String,
        trim: true,
    },
});


const Master_Allergies = mongoose.model('master_allergies', schema, "master_allergies");
module.exports = Master_Allergies;