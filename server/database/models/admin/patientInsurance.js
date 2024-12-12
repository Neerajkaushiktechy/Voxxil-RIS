const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    insuranceNameProvider: {
        type: String,
        trim: true,
    },
    insuranceId: {
        type: String,
        trim: true,
    },
    policyHolderName: {
        type: String,
        trim: true,
    },
    groupNumber: {
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


const PatientInsurance = mongoose.model('patientInsurance', schema, "patientInsurance");
module.exports = PatientInsurance;