const Appoinment = require("../../database/models/admin/appoinment");

exports.get = async (req, res) => {
    try {
        const data = await Appoinment.find({ createdBy: req.user.id, isDeleted: false, branchId: req.currentBranch }).select("appoinmentCategory appoinmentDate appoinmentTime appoinmentDuration startTime endTime");
        if (!data) {
            return res.status(404).json({ success: false, message: "Branch not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
