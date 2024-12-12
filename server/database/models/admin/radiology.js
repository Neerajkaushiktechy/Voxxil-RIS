const mongoose = require('mongoose');


const examListModality = new mongoose.Schema({
    examId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "examList"
        },
    examName: {
        type: String,
        trim: true
    },
    modalityId: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "modality"
    },
    modalityName: {
        type: String,
        trim: true
    },
    modalityDescription: {
        type: String,
        trim: true
    }
});
const examListSchema = new mongoose.Schema({
    group: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "examGroup"
    },
    examListModality: [examListModality],
    list: [{
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: "examList"
    }],
});




const schema = new mongoose.Schema(
    {
        appoinmentId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "appoinment"
        },
        patientId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "patientInformation"
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
        orderId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "order",
            default:null
        },
        examList: [examListSchema],
        isCorrectPatient: {
            type: Boolean

        },
        correctPatientValue: {
            type: String,
            trim: true
        },
        isCorrectSide: {
            type: Boolean

        },
        correctSideValue: {
            type: String,
            trim: true
        },
        isCorrectProcedure: {
            type: Boolean

        },
        correctProcedureValue: {
            type: String,
            trim: true
        },
        isContrast: {
            type: Boolean
        },
        contrastValue: {
            type: String,
            trim: true
        },
        isNonContrast: {
            type: Boolean

        },
        nonContrastValue: {
            type: String,
            trim: true
        },
        allergiesDetails: {
            type: String,
            trim: true
        },
        referringSignatureId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        referringSignaturePin: {
            type: String,
            trim: true
        },
        isReferringSignatureVerified: {
            type: Boolean,
            trim: true
        },
        referringDate: {
            type: Date,
            trim: true
        },
        authorisedId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        authorisedDate: {
            type: Date,
            trim: true
        },
        operatorId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        operatorDate: {
            type: Date,
            trim: true
        },
        appointerId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user"
        },
        reportId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "patientReport"
        },
        appointerSignaturePin: {
            type: String,
            trim: true
        },
        isAppointerSignatureVerified: {
            type: Boolean,
            trim: true
        },
        accessionNumber: {
            type: String,
            trim: true
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
        isReffered: {
            type: Boolean,
            trim: true,
            default: false
        },
        referralStatus: {
            type: String,
            trim: true,
            default: "none"
        },
        branchId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "branch"
        },
        isDeleted: {
            type: Boolean,
            dafault: false,
            trim: true,
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
        refferingDateAndTime: {
            type: Date,
            trim: true
        },
        orderAcceptStatus: {
            type: Boolean,
            dafault: null,
        },
        denialReasonText: {
            type: String,
            trim: true,
            dafault: null,
        },
        denialBy: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "user",
            dafault: null,
        },
        denialTimeString: {
            type: String,
            trim: true,
            dafault: null,
        },
        denialTimeUtc: {
            type: Date,
            trim: true,
            dafault: null,
        },
    },
    { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Radiology = mongoose.model('radiology', schema);

module.exports = Radiology;
