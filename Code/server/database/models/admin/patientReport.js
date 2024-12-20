const mongoose = require('mongoose');

const patientReportSchema = new mongoose.Schema(
    {
        completedExam: {
            type: [],
        },
        clinicalInfo: {
            type: String,
            trim: true,
        },
        diagnosticObjectives: {
            type: String,
            trim: true,
        },
        findings: {
            type: String,
            trim: true,
        },
        radiographicImpression: {
            type: String,
            trim: true,
        },
        reportStatus: {
            type: String,
            trim: true,
            default: "pending"
        },
        seniorRadiologistId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },

        branchId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "branch"
        },
        appointerId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        imageComments: [{
            imageID: {
                type: String,
                trim: true,
            },
            comment: {
                type: String,
                trim: true,
            }
        }],
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
        }
    },
    { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const PatientReport = mongoose.model('patientReport', patientReportSchema);

module.exports = PatientReport;
