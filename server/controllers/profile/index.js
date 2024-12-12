const User = require("../../database/models/auth/user");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const PatientInformation = require("../../database/models/admin/patientInformation");

exports.get = async (req, res) => {
    try {
        const data = await User.findById(req.user.id).select('-password');
        if (!data) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getPatientProfilesByUserEmail = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is not provided" });
        }

        const user = await User.findById(userId);

        const patientInfo = await PatientInformation.findOne({
            email: user.email,
            isDeleted: false
        });

        if (!patientInfo) {
            return res.status(404).json({ success: false, message: "Patient information not found for the user" });
        }

        return res.status(200).json({ success: true, data: patientInfo });

    } catch (error) {
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

exports.put = async (req, res) => {
    let { firstName, lastName, email, phone, gender, dob, country, state, city, zipCode, taxId, avatar, signaturePin = null, signatureImage } = req.body;
    if (dob == "null") dob = null

    if (avatar === "false") {
        const avatarDir = path.join('uploads', req.user.id, 'avatar');
        if (fs.existsSync(avatarDir)) {
            try {
                fs.rmSync(avatarDir, { recursive: true });
                console.log(`Avatar directory for user has been deleted.`);
            } catch (err) {
                console.error(`Error deleting avatar directory for user ${req.user.id}: ${err.message}`);
            }
        }
        avatar = null
    } else if (req?.files?.avatar) {
        avatar = req.files.avatar[0].originalname
    }

    if (signatureImage === "false") {
        const signatureImageDir = path.join('uploads', req.user.id, 'signatureImage');
        if (fs.existsSync(signatureImageDir)) {
            try {
                fs.rmSync(signatureImageDir, { recursive: true });
                console.log(`Avatar directory for user has been deleted.`);
            } catch (err) {
                console.error(`Error deleting avatar directory for user ${req.user.id}: ${err.message}`);
            }
        } 
        signatureImage = null
    } else if (signatureImage) {
        const base64Image = signatureImage.replace(/^data:image\/\w+;base64,/, '');
        signatureImage = "signature.png";
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const userId = req.user.id;
        const uploadDir = `uploads/${userId}/signatureImage`;

        // Create the "uploads" directory if it doesn't exist
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }

        // Create the user's directory if it doesn't exist
        if (!fs.existsSync(`uploads/${userId}`)) {
            fs.mkdirSync(`uploads/${userId}`);
        }

        // Create the "avatar" directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Write the binary buffer to the file system
        fs.writeFile(`${uploadDir}/signature.png`, imageBuffer, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    try {
        await User.findByIdAndUpdate(req.user.id, {
            firstName, lastName, email, phone, gender, dob, country, state, city, zipCode, taxId, avatar, signaturePin, signatureImage: signaturePin ? signatureImage : null
        });
        return res.status(200).json({ success: true, message: `Account successfully updated` });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
};

exports.updatePassword = async (req, res) => {
    const { oldPassword, password, confirmPassword } = req.body;
    try {
        if (!oldPassword || !password || !confirmPassword) { return res.status(400).json({ message: 'Fill required fields' }); }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (oldPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
        }
        // Update user data
        const newPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_HASH));

        await User.findByIdAndUpdate(req.user.id, { password: newPassword });
        return res.status(200).json({ success: true, message: `Account successfully updated` });
    } catch (err) {
        console.log(err)
        if (err.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Fill required fields", error: err.message });
        }
        return res.status(400).json({ success: false, message: "There is some error please try again later" });
    }
}