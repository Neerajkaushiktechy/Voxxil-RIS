const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    countryList: {
        type: Array,
        trim: true,
    },
    regionId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: "region"
    }
});

const Master_Countries = mongoose.model('master_countries', schema, "master_countries");
module.exports = Master_Countries;