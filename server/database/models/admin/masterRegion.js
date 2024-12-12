const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    region: {
        type: String,
        trim: true,
    },
});


const Master_Regions = mongoose.model('master_regions', schema, "master_regions");
module.exports = Master_Regions;