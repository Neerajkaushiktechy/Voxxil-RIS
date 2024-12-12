const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const controller = require("../../controllers/staff");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');
const { STAFF } = require("../../constant")


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

const allValidRoles = ["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]

router.get('/api/staff', verifyToken, roleChecker([...allValidRoles]), checkCurrentBranch(), controller.search);
router.get('/api/userlist', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.get);
router.get('/api/saff-list', verifyToken, roleChecker([...allValidRoles, STAFF]), checkCurrentBranch(), controller.getStaffList);
router.post('/api/user', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(),upload, controller.post);
router.delete('/api/user/:id', verifyToken, roleChecker(["admin","juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(),controller.delete);
router.get('/api/user/:id/:fieldName/:fileName', verifyToken, roleChecker(["admin","juniorRadiologist", "seniorRadiologist"]), controller.getAvatar);
router.put('/api/user', verifyToken,roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), upload, controller.put);


module.exports = router;