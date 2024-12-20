const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    department: {
        type: String,
        trim: true,
    },
});


const Master_Patient_Department = mongoose.model('Master_Patient_Department', schema, "Master_Patient_Department");
module.exports = Master_Patient_Department;