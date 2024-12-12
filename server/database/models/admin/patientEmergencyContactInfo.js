const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    emergencyContactName: {
        type: String,
        trim: true,
    },
    relationShipToPatient: {
        type: String,
        trim: true,
    },
    emergencyContactNumber: {
        type: Number,
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


const PatientEmergencyContactInfo = mongoose.model('patientEmergencyContactInfo', schema, "patientEmergencyContactInfo");
module.exports = PatientEmergencyContactInfo;