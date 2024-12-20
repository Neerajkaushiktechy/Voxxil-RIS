const User = require("../../database/models/auth/user");

exports.appointerSignature = async (req, res) => {
    const { signaturePin, appointerId } = req.body;
    try {
        const data = await User.findOne({ _id: appointerId, signaturePin }).select("firstName lastName signatureImage");
        if (!data) return res.status(400).json({ success: false, message: 'Signature pin not valid ' });
        return res.status(200).json({ success: true, message: "Data found", data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};