const mongoose = require('mongoose');
// Define the User schema
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
    insurance: {
        insuranceNameProvider: String,
        insuranceId: String,
        policyHolderName: String
    },
    physician: {
        physicianName: String,
        phone: Number,
        email: String,
        address: String,
        methodOfCommunication: String
    },
    medicalHistory: {
        allergies: String,
        diagnosis: String,
        illness: String,
        department: String,
        medications: String,
        comments: String,
        familyHereditaryHealth: String,
        familyMemberHealthHistory: String,
        imagingStudies: [
            {
                type: Object,
            },
        ],
    },
    lifeStyleInfo: {
        occupation: String,
        addictions: String,
        dietHabits: String
    },
    acknowledgement: [
        {
            type: String,
        },
    ],
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


const PatientRegistration = mongoose.model('patientRegistration', schema, "patientRegistration");
module.exports = PatientRegistration;