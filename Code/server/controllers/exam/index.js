const ExamGroup = require("../../database/models/admin/examGroup");
const ExamList = require("../../database/models/admin/examList");

exports.postGroup = async (req, res) => {
    const { name, list } = req.body;
    try {
        const data = await ExamGroup.findOne({ name: { $regex: new RegExp(name, 'i') } });
        if (data) {
            return res.status(400).json({ success: false, message: "Exam group name already Exist" });
        }
        let newGroup = await ExamGroup.create({ name, list, createdBy: req.user.id, updatedBy: req.user.id, branchId: req.currentBranch,isDeleted : false });
        await ExamList.updateMany({ _id: { $in: newGroup.list } }, { group: newGroup._id });
        return res.status(201).json({ success: true, message: "Exam Group successfully Added" });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.getGroupById = async (req, res) => {
    const { dataQuery } = req.query;
    const parsedDataQuery = JSON.parse(dataQuery);
    try {
        const data = await ExamGroup.find({ branchId: { $in: [null, req.currentBranch] }, isDeleted: false, name: { $in: parsedDataQuery.map(query => new RegExp(query, 'i')) } }).populate({ path: "list", select: "name modality" });
        if (!data) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getGroup = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const searchQuery = req.query.searchQuery || "";
    try {
        const data = await ExamGroup.find({ branchId: { $in: [null, req.currentBranch] }, isDeleted: false, name: { $regex: new RegExp(searchQuery, 'i') } }).populate({ path: "list", select: "name" }).select("-updatedBy -createdBy -isDeleted")
            .skip((page - 1) * limit)
            .limit(limit);
        if (!data) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        const dataCount = await ExamGroup.countDocuments({ branchId: { $in: [null, req.currentBranch] }, isDeleted: false, name: { $regex: new RegExp(searchQuery, 'i') } });
        return res.status(200).json({ success: true, data, dataCount });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.putGroup = async (req, res) => {
    const { _id, name, list } = req.body;
    try {
        const updatedGroup = await ExamGroup.findByIdAndUpdate(_id, { name, list }, { new: true })
        // Find all ExamList documents with the old group ID and update them
        await ExamList.updateMany({ group: updatedGroup._id }, { group: null });

        // Find all ExamList documents with the new group IDs and update them
        await ExamList.updateMany({ _id: { $in: updatedGroup.list } }, { group: updatedGroup._id });

        return res.status(200).json({ success: true, message: `Exam successfully updated` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        await ExamGroup.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `Exam successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


exports.postList = async (req, res) => {
    const { name, modality, modalityDescription } = req.body;
    try {
        const data = await ExamList.findOne({ name: { $regex: new RegExp(name, 'i') } });
        if (data) {
            return res.status(400).json({ success: false, message: "Exam name already Exist" });
        }
        await ExamList.create({ name, modality, modalityDescription, createdBy: req.user.id, updatedBy: req.user.id, branchId:  req?.currentBranch,isDeleted : false  });
        return res.status(201).json({ success: true, message: "Exam successfully Added" });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.getList = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const searchQuery = req.query.searchQuery || "";


    try {
        let query = ExamList.find({
            name: { $regex: new RegExp(searchQuery, 'i') },
            branchId: { $in: [null, req.currentBranch] },   
            isDeleted: false
        }).populate({ path: "group", select: "name" })
            .skip(limit ? (page - 1) * limit : 0)
            .limit(limit || 0);

        const data = await query.exec();
        
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        const dataCount = await ExamList.countDocuments({name: { $regex: new RegExp(searchQuery, 'i') },branchId: { $in: [null, req.currentBranch] },isDeleted: false});
        return res.status(200).json({ success: true, data, dataCount });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.putList = async (req, res) => {
    const { _id, name, modality, modalityDescription} = req.body;
    try {
        await ExamList.findByIdAndUpdate(_id, { name, modality, modalityDescription });
        return res.status(200).json({ success: true, message: `Exam successfully updated` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.deleteList = async (req, res) => {
    try {
        await ExamList.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `Exam successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};