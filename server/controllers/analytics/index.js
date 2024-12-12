const Order = require("../../database/models/admin/order");
const Appointments = require("../../database/models/admin/appoinment");
const RadioLogy = require("../../database/models/admin/radiology");
const Report = require("../../database/models/admin/patientReport");
const moment = require('moment');


exports.get = async (req, res) => {
    try {
        const { month } = req.params;
        let startDate, endDate;

        if (month === "thisMonth") {
            startDate = moment().startOf('month');
            endDate = moment().endOf('month');
        } else if (month === "lastMonth") {
            startDate = moment().subtract(1, 'months').startOf('month');
            endDate = moment().subtract(1, 'months').endOf('month');
        } else if (month === "lastTwoMonths") {
            startDate = moment().subtract(2, 'months').startOf('month');
            endDate = moment().subtract(1, 'months').endOf('month');
        } else {
            return res.status(400).json({ success: false, message: "Invalid month selection" });
        }

        const exams = await RadioLogy.find({ isDeleted: false, createdAt: { $gte: startDate, $lte: endDate } })
            .select('examList')
            .populate({
                path: 'examList',
                populate: {
                    path: 'list',
                    select: 'name'
                }
            })
            .exec();
        console.log(exams, "exams")

        // Flatten the array and extract all exam names
        const allExams = exams.flatMap(exam => exam.examList.flatMap(subExam => subExam.list.map(item => item.name)));

        // Count the occurrences of each exam name
        const examCounts = {};
        allExams.forEach(exam => {
            examCounts[exam] = (examCounts[exam] || 0) + 1;
        });

        // Sort the exams by count in descending order
        const sortedExams = Object.keys(examCounts).sort((a, b) => examCounts[b] - examCounts[a]);

        // Select the top 5 most occurring exams
        const top5Exams = sortedExams.slice(0, 5);

        const cancelledAppointments = await Order.countDocuments({
            status: "Appointment Cancelled",
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const completedReports = await Report.countDocuments({
            approvedBy: { $exists: true, $ne: null },
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const incompletedReports = await Report.countDocuments({
            $or: [{ approvedBy: null }, { approvedBy: { $exists: false } }],
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const modifiedReports = await Report.countDocuments({
            updatedBy: { $exists: true, $ne: null },
            createdAt: { $gte: startDate, $lte: endDate }
        });

        return res.status(200).json({
            success: true,
            cancelledAppointments: cancelledAppointments,
            completedReports: completedReports,
            incompletedReports: incompletedReports,
            modifiedReports: modifiedReports,
            topTakenExams: top5Exams
        });
    } catch (error) {
        console.log(error, "error");
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
