const mongoose = require('mongoose');
// Define the User schema
const schema = new mongoose.Schema({
    acknowledgement: [
        {
            type: String,
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


const PatientAcknowledgement = mongoose.model('patientAcknowledgement', schema, "patientAcknowledgement");
module.exports = PatientAcknowledgement;