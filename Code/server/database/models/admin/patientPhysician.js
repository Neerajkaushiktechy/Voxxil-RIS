const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    physicianName: {
        type: String,
        trim: true,
    },
    phone: {
        type: Number,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    methodOfCommunication: {
        type: String,
        trim: true,
    },
    pId: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "patientInformation"
    },
    branchId: {
        type: mongoose.Types.ObjectId,
        trim: true,
    },
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        trim: true,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        trim: true,
    }
});


const PatientPhysician = mongoose.model('patientPhysician', schema, "patientPhysician");
module.exports = PatientPhysician;