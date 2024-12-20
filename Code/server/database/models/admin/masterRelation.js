const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    relation: {
        type: String,
        trim: true,
    },
});


const Master_Relations = mongoose.model('master_relations', schema, "master_relations");
module.exports = Master_Relations;