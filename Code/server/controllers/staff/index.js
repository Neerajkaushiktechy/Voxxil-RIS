const User = require("../../database/models/auth/user");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const { USER_ROLE } = require('../../constant')

exports.search = async (req, res) => {
    const { name } = req.query;
    try {
        const query = {
            $or: [
                { firstName: { $regex: new RegExp(name, 'i') } },
            ],
        };

        const data = await User.find(query).select("firstName lastName gender email dob");
        res.status(200).json({ success: true, message: "Data found", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.get = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const searchQuery = req.query.searchQuery || "";
    try {
        let query = User.find({
            name: { $regex: new RegExp(searchQuery, 'i') },
            branchId: { $in: [null, req.currentBranch] },
            isDeleted: false,   
            role: {$ne: USER_ROLE.patient}
        }).select({password:0}).skip(limit ? (page - 1) * limit : 0)
        .limit(limit || 0);;

        const data = await query.exec();

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        const dataCount = await User.countDocuments({
            name: { $regex: new RegExp(searchQuery, 'i') },
            branchId: { $in: [null, req.currentBranch] },
            isDeleted: false,
        });
        // await sendPatientRemainderMail()
        return res.status(200).json({ success: true, data,dataCount });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getStaffList = async (req, res) => {
    try {
        let query = User.find({
            branchId: req.currentBranch,
            isDeleted: false,   
        }).select({password:0});

        const data = await query.exec();

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAvatar = async (req, res) => {
    let { id, fieldName, fileName } = req.params;
    try {
        const file = path.join(__dirname, '../..', `uploads/${id}/${fieldName}/`, fileName);
        if (!fs.existsSync(file)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        res.sendFile(file);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.post = async (req, res) => {
    let { firstName, lastName, email, phone, gender, dob, country, state, city, zipCode, taxId, signaturePin = null, signatureImage, role, password } = req.body;
    if (dob == "null") dob = null;
    // Check if required fields are missing

    if (!firstName || !email) {
        return res.status(400).json({ success: false, message: "Fill all required fields" });
    }

    const name = `${firstName} ${lastName}`;

    try {
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            name,
            phone,
            gender,
            dob,
            country,
            state,
            city,
            zipCode,
            taxId,
            role,
            password,
            branchId: req.currentBranch,
        });
        return res.status(201).json({ success: true, message: `User successfully created`, user: newUser });
    } catch (err) {
        console.error(err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Validation Error", error: err.message });
        }
        return res.status(500).json({ success: false, message: "There is some error, please try again later" });
    }
};

exports.put = async (req, res) => {
    let { _id, firstName, lastName, email, phone, gender, dob, country, state, city, zipCode, taxId, avatar, signaturePin = null, signatureImage, role, password } = req.body;
    if (dob == "null") dob = null

    // Check if required fields are missing
    if (!firstName || !email) {
        return res.status(400).json({ success: false, message: "Fill all required fields testing thi error is coming" });
    }

    const name = `${firstName} ${lastName}`;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_HASH));
        password = hashedPassword;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstName, lastName, email,name, phone, gender, dob, country, state, city, zipCode, taxId, role, password
        });
        return res.status(200).json({ success: true, message: `User successfully updated`,user: updatedUser });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


exports.delete = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
        return res.status(200).json({ success: true, message: `User successfully Deleted` });
    } catch (err) {
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};


