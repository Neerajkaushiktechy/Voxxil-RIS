const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            require: true,
            trim: true
        },
        patientId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "patientInformation"
        },
        radiologyId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "radiology"
        },
        status: {
            type: String,
            default: "Requested",
            trim: true
        },

        appoinmentCompleteDescription: {
            type: String,
            trim: true
        },
        appoinmentCompleteStaffId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        appoinmentCompleteStaffSignaturePin: {
            type: String,
            trim: true
        },

        orthancStudyID: {
            type: String,
            trim: true
        },
        orthancStudyDescription: {
            type: String,
            trim: true
        },
        orthancStudyInstanceUID: {
            type: String,
            trim: true
        },

        branchId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "branch"
        },
        invoiceId: {
            type: String,
            trim: true,
            default: "null"
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

const Order = mongoose.model('order', appointmentSchema);

module.exports = Order;
