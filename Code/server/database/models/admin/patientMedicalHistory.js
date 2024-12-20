const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    allergies: {
        type: String,
        trim: true,
    },
    diagnosis: {
        type: String,
        trim: true,
    },
    illness: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    medications: {
        type: String,
        trim: true,
    },
    comments: {
        type: String,
        trim: true,
    },
    familyHereditaryHealth: {
        type: String,
        trim: true,
    },
    familyMemberHealthHistory: {
        type: String,
        trim: true,
    },
    imagingStudies: [
        {
            type: Object,
        },
    ],
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


const PatientMedicalHistory = mongoose.model('patientMedicalHistory', schema, "patientMedicalHistory");
module.exports = PatientMedicalHistory;