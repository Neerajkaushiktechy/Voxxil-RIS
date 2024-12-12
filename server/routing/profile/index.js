const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const profileController = require("../../controllers/profile");
const verifyToken = require('../../middleware/tokenVerify');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user.id;
        const uploadDir = `uploads/${userId}/${file.fieldname}`; // You can change this to your desired folder name

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

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Get the file extension
        const fileExtension = path.extname(file.originalname).toLowerCase();
        // Check if the file extension is allowed
        if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            // Generate a unique filename if needed
            // Combine the unique filename with the original extension
            const finalFilename = file.originalname;
            cb(null, finalFilename);
        } else {
            // Return an error if the file extension is not allowed
            cb(new Error('File extension is not allowed'));
        }
    },
});

// Create a multer instance with the defined storage
const upload = multer({ storage: storage }).fields([
    { name: 'avatar', maxCount: 1 },
]);

router.get('/api/profile', verifyToken, profileController.get);
router.get('/api/patient-profile', verifyToken, profileController.getPatientProfilesByUserEmail);
router.put('/api/profile', verifyToken, upload, profileController.put);
router.put('/api/profile-password', verifyToken, profileController.updatePassword);
router.get('/api/profile/:id/:fieldName/:fileName',  profileController.getAvatar);

module.exports = router;