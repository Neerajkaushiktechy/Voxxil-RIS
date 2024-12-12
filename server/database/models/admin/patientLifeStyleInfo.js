const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    occupation: {
        type: String,
        trim: true,
    },
    addictions: {
        type: Boolean,
    },
    dietHabits: {
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


const PatientLifeStyleInfo = mongoose.model('patientLifeStyleInfo', schema, "patientLifeStyleInfo");
module.exports = PatientLifeStyleInfo;