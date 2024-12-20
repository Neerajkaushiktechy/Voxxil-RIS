const Modality = require("../../database/models/admin/modality");
const User = require("../../database/models/auth/user")


exports.post = async (req, res) => {
    const { term, decription } = req.body;
    try {
        const existingModality = await Modality.findOne({ term: term, isDeleted: false});
        if (existingModality) {
            return res.status(400).json({ success: false, message: "Modality already Exist" });
        }
        await Modality.create({ term, decription, isDeleted:false });
        return res.status(201).json({ success: true, message: "Modality successfully Added" });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


exports.get = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const searchQuery = req.query.searchQuery || "";
        const data = await Modality.find({ term: { $regex: new RegExp(searchQuery, 'i') },isDeleted: false }) .skip(limit ? (page - 1) * limit : 0)
        .limit(limit || 0);
        const dataCount = await Modality.countDocuments({ term: { $regex: new RegExp(searchQuery, 'i') },isDeleted: false });
        if (!data) {
            return res.status(404).json({ success: false, message: "Modality not found" });
        }
        return res.status(200).json({ success: true, data, dataCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.put = async (req, res) => {
    const { _id, term, decription } = req.body;
    try {
        await Modality.findByIdAndUpdate(_id, { term, decription });
        return res.status(200).json({ success: true, message: `Modality successfully updated` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.delete = async (req, res) => {
    try {
        await Modality.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `Modality successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};