const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "patientInformation"
        },
        orderId: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: "order"
        },
        invoiceDetail: [{
            orderId: {
                type: String,
                trim: true,
            },
            examId: {
                type: String,
                trim: true,
            },
            unit: {
                type: String,
                trim: true,
            },
            unitPrice: {
                type: String,
                trim: true,
            },
            cost: {
                type: String,
                trim: true,
            },
            orderDate: {
                type: String,
                trim: true
            }
        }],

        totalCost: {
            type: String,
            trim: true,
        },

        invoiceId: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true
        },
        invoiceFilePath: {
            type: String
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
        }
    },
    { timestamps: true } // Add timestamps for createdAt and updatedAt
);

const Billing = mongoose.model('billing', billingSchema);

module.exports = Billing;
