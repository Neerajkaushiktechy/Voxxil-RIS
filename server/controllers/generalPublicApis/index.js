const Enquiry = require("../../database/models/enquiry/enquiry");

exports.post = async (req, res) => {
    const { fullName, companyName, email } = req.body;
    try {
        const existingBranch = await Enquiry.findOne({ email });
        if (existingBranch) {
            return res.status(400).json({ success: false, message: "Record already exists" });
        }
        await Enquiry.create({  fullName, companyName, email });
        return res.status(201).json({ success: true, message: "Thank you for contact with us", status: 201 });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};