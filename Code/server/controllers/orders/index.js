const Order = require("../../database/models/admin/order");
const PatientInformation = require("../../database/models/admin/patientInformation");
const User = require("../../database/models/auth/user");

exports.get = async (req, res) => {
    try {
        const { value, elm } = req.params;
        if (elm === "patient") {
            let patient = value
            const patients = await PatientInformation.find({
                // createdBy: req.user.id,
                // branchId: req.currentBranch,
                fName: { $regex: `^${patient}`, $options: 'i' }
            }).select('fName orderId lName gender dob email _id');
            const orders = await Order.find({
                // createdBy: req.user.id,
                branchId: req.currentBranch,
                patientId: patients[0]?._id,
                status: "Appointment Complete",
            }).select('orderId');
            if (!patients || patients.length === 0) {
                return res.status(400).json({ success: false, message: 'Patient data not found' });
            }
            return res.status(200).json({ success: true, patients, orders });
        }
        if (elm === "order") {
            let orderId = value
            const orders = await Order.find({
                // createdBy: req.user.id,
                branchId: req.currentBranch,
                orderId: { $regex: `^${orderId}`, $options: 'i' },
            }).select('orderId');

            if (!orders || orders.length === 0) {
                return res.status(400).json({ success: false, message: 'Order data not found' });
            }

            return res.status(200).json({ success: true, orders });
        }
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// exports.getId = async (req, res) => {
//     console.log(req.params.id, "id")
//     try {
//         const data = await Order.findOne({ orderId: req.params.id, createdBy: req.user.id, branchId: req.currentBranch, isDeleted: false }).select("orderId status patientId radiologyId appoinmentCompleteDescription appoinmentCompleteStaffId")
//             .populate({
//                 path: "appoinmentCompleteStaffId",
//                 select: "firstName lastName"
//             })
//             .populate("patientId")
//             .populate({
//                 path: "radiologyId",
//                 populate: ([
//                     {
//                         path: "appoinmentId",
//                         select: "appoinmentCategory startTime appoinmentDuration",
//                     },
//                     {
//                         path: "examList",
//                         populate: [{
//                             path: "group",
//                             select: "name",
//                         },
//                         {
//                             path: "list",
//                             select: "name",
//                         }]
//                     }]),
//                 select: "examList appoinmentId",
//             });

//         if (!data) {
//             return res.status(404).json({ success: false, message: "Account not found" });
//         }
//         return res.status(200).json({ success: true, data });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

exports.getId = async (req, res) => {
    try {
        const orderIds = req.params.id.split(','); // Splitting IDs if multiple IDs are provided

        const data = await Order.find({
            orderId: { $in: orderIds },
            // createdBy: req.user.id,
            branchId: req.currentBranch,
            isDeleted: false
        })
            .select("orderId status patientId radiologyId appoinmentCompleteDescription appoinmentCompleteStaffId createdAt")
            .populate({
                path: "appoinmentCompleteStaffId",
                select: "firstName lastName"
            })
            .populate("patientId")
            .populate({
                path: "radiologyId",
                populate: ([
                    {
                        path: "appoinmentId",
                        select: "appoinmentCategory startTime appoinmentDuration",
                    },
                    {
                        path: "examList",
                        populate: [{
                            path: "group",
                            select: "name",
                        },
                        {
                            path: "list",
                            select: "name",
                        }]
                    }]),
                select: "examList appoinmentId",
            });

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Orders not found" });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.getPatientOrders = async (req, res) => {
    try {
        const data = await Order.find({ patientId: req.params.id, createdBy: req.user.id, branchId: req.currentBranch, isDeleted: false }).select("orderId status patientId radiologyId appoinmentCompleteDescription appoinmentCompleteStaffId")
            .populate({
                path: "appoinmentCompleteStaffId",
                select: "firstName lastName signatureImage"
            })
            .populate({
                path: "radiologyId",
                populate: ([
                    {
                        path: "appoinmentId",
                        select: "appoinmentCategory startTime appoinmentDuration",
                    },
                    {
                        path: "examList",
                        populate: [{
                            path: "group",
                            select: "name",
                        },
                        {
                            path: "list",
                            select: "name",
                        }]
                    }]),
                select: "examList appoinmentId",
            });

        if (!data) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.putOrderStatus = async (req, res) => {
    const { orderId, status, appoinmentCompleteDescription, appoinmentCompleteStaffId, appoinmentCompleteStaffSignaturePin } = req.body;
    if (!appoinmentCompleteStaffId || !appoinmentCompleteStaffSignaturePin || !status || !orderId) {
        return res.status(400).json({ success: false, message: "Fill required fields" });
    }

    try {
        let appoinmentCompleteStaffVerified = false;
        if (appoinmentCompleteStaffId && appoinmentCompleteStaffSignaturePin) {
            const data = await User.findById(appoinmentCompleteStaffId);
            appoinmentCompleteStaffVerified = appoinmentCompleteStaffSignaturePin === data?.signaturePin;
        }

        if (!appoinmentCompleteStaffVerified) {
            return res.status(400).json({ success: false, message: "signaturePin not valid" });
        }

        await Order.findOneAndUpdate({ orderId }, { status, appoinmentCompleteDescription, appoinmentCompleteStaffId, appoinmentCompleteStaffSignaturePin });
        return res.status(200).json({ success: true, message: `Order successfully updated` });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

