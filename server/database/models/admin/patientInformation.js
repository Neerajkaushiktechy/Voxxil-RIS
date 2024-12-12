const mongoose = require('mongoose');
// Define the User schema
const belongsToSchema = new mongoose.Schema({
    createdByBranch: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "branch",
        default: null
    },
    refferedToBranch: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "branch",
        default: null
    },
    radiologyId: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "radiology"
    },
    appoinmentId: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "appoinment"
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "order",
    },
},  { timestamps: true });

const schema = new mongoose.Schema({
    fName: {
        type: String,
        trim: true,
    },
    lName: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        trim: true,
    },
    dob: {
        type: String,
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
    region: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    postalCode: {
        type: Number,
        trim: true,
    },
    methodOfCommunication: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    },
    orthancPatientId: {
        type: String,
        trim: true,
        // default: "b191c30e-db18-4d25-b156-6b6bc2dda995"
    },
    orthancParentPatientId: {
        type: String,
        trim: true,
    },
    branchId: {
        type: mongoose.Types.ObjectId,
        trim: true,
    },
    belongsTo: {
        type: [belongsToSchema],
        default:[]
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
},
    { timestamps: true }
);

// mongoose.set('debug', true)
const PatientInformation = mongoose.model('patientInformation', schema, "patientInformation");
module.exports = PatientInformation;