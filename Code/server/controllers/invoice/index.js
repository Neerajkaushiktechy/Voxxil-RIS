const Order = require("../../database/models/admin/order");
const Invoice = require("../../database/models/admin/invoice");
const ExamList = require("../../database/models/admin/examList");
const invoicePdfGenerator = require('../../helper/invoicePdfGenerator')
const User = require("../../database/models/auth/user")
const moment = require('moment');
const fs = require('fs');
const { USER_ROLE } = require("../../constant");
const PatientInformation = require("../../database/models/admin/patientInformation");

exports.getInvoice = async (req, res) => {
    const user = await User.findById(req.user.id);
    try {
       let invoicesStatus=[];
        const { type } = req.params;
        if (type === "billedInvoice") {
            if (req.user.role === USER_ROLE.patient) {
                const user = await User.findById(req.user.id);
                const patient = await PatientInformation.findOne({ email: user.email });
                invoicesStatus = await Invoice.find({
                patientId: patient._id,
                invoiceId: { $ne: "null" },
            }).select('patientId createdAt invoiceDetail invoiceId totalCost notes').populate({ path: "patientId", select: "fName lName dob email gender address country postalCode" });

            for (const invoice of invoicesStatus) {
                for (const item of invoice.invoiceDetail) {
                    const examData = await ExamList.findOne({ _id: item.examId });
                    if (examData) {
                        item.examId = examData.name
                    }
                }
            }
        }
        else{
             invoicesStatus = await Invoice.find({
                createdBy: req.user.id,
                branchId: req.currentBranch,
                invoiceId: { $ne: "null" },
            }).select('patientId createdAt invoiceDetail invoiceId totalCost notes').populate({ path: "patientId", select: "fName lName dob email gender address country postalCode" });

            for (const invoice of invoicesStatus) {
                for (const item of invoice.invoiceDetail) {
                    const examData = await ExamList.findOne({ _id: item.examId });
                    if (examData) {
                        // console.log(item, "item")
                        item.examId = examData.name
                    }
                }
            }}
            return res.status(200).json({ success: true, invoicesStatus });

        } else if (type === "unbilledInvoice") {
            const invoicesStatus = await Order.find({
                createdBy: req.user.id,
                branchId: req.currentBranch,
                invoiceId: "null",
                status: "Appointment Complete",
            }).select('orderId patientId createdAt').populate({ path: "patientId", select: "fName lName" });

            return res.status(200).json({ success: true, invoicesStatus });

        } else {
            return res.status(400).json({ success: false, message: 'Invalid parameters' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// exports.postInvoice = async (req, res) => {
//     console.log(req.body, "body")
//     try {
//         const { invoiceDetail, totalCost, patientId, notes } = req.body;
//         const createdBy = req.user.id;
//         const branchId = req.currentBranch;
//         console.log(invoiceDetail, "detail")
//         const invoice = new Invoice({
//             patientId,
//             invoiceDetail: invoiceDetail,
//             totalCost,
//             notes,
//             branchId,
//             createdBy,
//         });
//         const invoiceID = generateInvoiceID();
//         invoice.invoiceId = invoiceID;
//         await invoice.save();
//         for (const orderData of invoiceDetail) {
//             const { orderId } = orderData;
//             const order = await Order.findOne({ orderId });
//             if (order) {
//                 order.invoiceId = invoiceID;
//                 await order.save();
//             }
//         }

//         return res.status(201).json({ success: true, message: 'Invoice created successfully', invoice });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };



exports.postInvoice = async (req, res) => {
    console.log(req.body, "body")
    try {
        const { invoiceDetail, totalCost, patientId, notes } = req.body;
        const createdBy = req.user.id;
        const branchId = req.currentBranch;
        // console.log(invoiceDetail, "detail")
        const invoice = new Invoice({
            patientId,
            invoiceDetail: invoiceDetail,
            totalCost,
            notes,
            branchId,
            createdBy,
        });
        const invoiceID = generateInvoiceID();
        invoice.invoiceId = invoiceID;
        await invoice.save();
        for (const orderData of invoiceDetail) {
            const { orderId } = orderData;
            const order = await Order.findOne({ orderId });
            if (order) {
                order.invoiceId = invoiceID;
                await order.save();
            }
        }
        if (res.status(201)) {
            const invoiceData = await Invoice.findOne({ invoiceId: invoiceID }).select('patientId createdAt invoiceDetail invoiceId totalCost notes').populate({ path: "patientId", select: "fName lName dob email gender address country postalCode" });
            const invoiceArrayData = [invoiceData]
            console.log(invoiceArrayData, "invoiceArray")
            for (const invoice of invoiceArrayData) {
                for (const item of invoice.invoiceDetail) {
                    const examData = await ExamList.findOne({ _id: item.examId });
                    if (examData) {
                        // console.log(item, "item")
                        item.examId = examData.name
                    }
                }
            }
            //    console.log(invoiceArrayData, "allData")
            // Create directory for invoice
            //  const directoryPath = `invoices/${patientId}/${invoiceID}`;
            // fs.mkdirSync(directoryPath, { recursive: true });

            // Generate PDF with custom data
            // const currentDate = moment().format('YYYY-MM-DD-HH-mm-ss'); // Get current date and time formatted using moment
            // const pdfPath = `${directoryPath}/${invoiceID}_(${currentDate}).pdf`; // Append current date and time to filename
            // await invoicePdfGenerator({ invoiceArrayData }, pdfPath);
        }

        return res.status(201).json({ success: true, message: 'Invoice created successfully', invoice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.putInvoice = async (req, res) => {
    try {
        console.log(req.body, "body")
        const { invoiceDetail, totalCost, invoiceId, notes } = req.body;
        const existingInvoice = await Invoice.findOne({ invoiceId });

        if (!existingInvoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        // Update invoiceDetail items based on _id
        existingInvoice.invoiceDetail = existingInvoice.invoiceDetail.map(existingItem => {
            const invoiceToUpdate = invoiceDetail.find(invoice => existingItem._id.toString() === invoice._id.toString());
            if (invoiceToUpdate != null) {
                existingItem.unit = invoiceToUpdate.unit;
                existingItem.unitPrice = invoiceToUpdate.unitPrice;
                existingItem.cost = invoiceToUpdate.cost;
            }
            return existingItem;
        })

        // Update other fields
        existingInvoice.totalCost = totalCost || existingInvoice.totalCost;
        existingInvoice.notes = notes || existingInvoice.notes;

        await existingInvoice.save();

        // Check if the directory exists for the patient and invoiceID
        // const patientId = existingInvoice.patientId;
        // const directoryPath = `invoices/${patientId}/${invoiceId}`;
        // if (!fs.existsSync(directoryPath)) {
        //     fs.mkdirSync(directoryPath, { recursive: true });
        // }

        // Generate PDF with custom data
        const invoiceData = await Invoice.findOne({ invoiceId }).select('patientId createdAt invoiceDetail invoiceId totalCost notes').populate({ path: "patientId", select: "fName lName dob email gender address country postalCode" });
        const invoiceArrayData = [invoiceData];
        for (const invoice of invoiceArrayData) {
            for (const item of invoice.invoiceDetail) {
                const examData = await ExamList.findOne({ _id: item.examId });
                if (examData) {
                    item.examId = examData.name;
                }
            }
        }

        // const currentDate = moment().format('YYYY-MM-DD-HH-mm-ss');
        // const pdfPath = `${directoryPath}/${invoiceId}_(${currentDate}).pdf`;
        //  await invoicePdfGenerator({ invoiceArrayData }, pdfPath);

        return res.status(200).json({ success: true, message: 'Invoice updated successfully', invoice: existingInvoice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



function generateInvoiceID() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${randomNum}`;
}