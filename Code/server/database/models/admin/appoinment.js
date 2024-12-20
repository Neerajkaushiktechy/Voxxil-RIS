const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        appoinmentCategory: {
            type: String,
            trim: true
        },
        startTime: {
            type: Date,
            trim: true,
            default:null
        },
        endTime: {
            type: Date,
            trim: true,
            default:null
        },
        appoinmentDuration: {
            type: String,
            trim: true,
            default:null
        },
        referId: {
            type: String,
            trim: true
        },
        referringConsultant: {
            type: String,
            trim: true,
            default:null
        },
        isPregnant: {
            type: Boolean,
            trim: true
        },
        lmp: {
            type: Number,
            trim: true
        },
        patientId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "patientInformation"
        },
        examReason: {
            type: String,
            trim: true,
            default: ""
        },

        branchId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "branch"
        },
        isDeleted: {
            type: Boolean,
            trim: true,
            dafault: false
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
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
    },
    { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Appoinment = mongoose.model('appoinment', appointmentSchema);

module.exports = Appoinment;
