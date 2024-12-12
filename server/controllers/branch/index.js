const Branch = require("../../database/models/admin/branch");
const User = require("../../database/models/auth/user")
const PatientInformation = require("../../database/models/admin/patientInformation");

exports.post = async (req, res) => {
    const { name, email, phone, city, state, country, address,branchCode } = req.body;
    try {
        const existingBranch = await Branch.findOne({ $or: [{ email, createdBy: req.user.id }] });
        if (existingBranch) {
            return res.status(400).json({ success: false, message: "Branch email already Exist" });
        }
        await Branch.create({ name, email, phone, city, state, country, address,branchCode, createdBy: req.user.id, isDeleted: false });
        return res.status(201).json({ success: true, message: "Branch successfully Added" });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


// exports.get = async (req, res) => {
//     try {
//         const data = await Branch.find({ createdBy: req.user.id, isDeleted: false });
//         if (!data) {
//             return res.status(404).json({ success: false, message: "Branch not found" });
//         }
//         return res.status(200).json({ success: true, data });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };
exports.getReferralBranch = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log('user...', user)
        data = await Branch.find({_id: {$ne: user.branchId}});
        return res.status(200).json({ success: true, data: data });
    } catch(err){
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


exports.get = async (req, res) => {
    try {
        let data = []
        const user = await User.findById(req.user.id);
        if(req.user.role === 'Patient') {
            let branchIds = [];
            const patient = await PatientInformation.aggregate([
                        { $match:{email: user.email}},
                        {$project: {
                            _id:0,
                            branchId:1,
                            belongsTo: {
                                createdByBranch: 1,
                                refferedToBranch: 1
                            }
                        }}
                    ]).exec();
            branchIds.push(patient[0].branchId);
            await patient[0].belongsTo.map(data => {
                branchIds = [...branchIds, data.createdByBranch, data.refferedToBranch];
            })
            data = await Branch.find({ _id: {$in: branchIds} });
        } else {
            data = await Branch.find({ createdBy: req.user.id, isDeleted: false });
            if (!data || data.length === 0) {
                
                if (user && user.branchId) {
                    data = await Branch.findById(user.branchId);
                    if (!data) {
                        return res.status(404).json({ success: false, message: "Branch not found" });
                    }
                    return res.status(200).json({ success: true, data: [data] });
                } else {
                    return res.status(404).json({ success: false, message: "User branchId not found" });
                }
            }
        }
        
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.put = async (req, res) => {
    const { _id, name, email, phone, city, state, country, address } = req.body;
    try {
        await Branch.findByIdAndUpdate(_id, { name, email, phone, city, state, country, address });
        return res.status(200).json({ success: true, message: `Branch successfully updated` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.delete = async (req, res) => {
    try {
        await Branch.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `Branch successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};