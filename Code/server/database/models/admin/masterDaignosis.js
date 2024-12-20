const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    daignosis: {
        type: String,
        trim: true,
    },
});


const Master_Daignosis = mongoose.model('master_daignosis', schema, "master_daignosis");
module.exports = Master_Daignosis;