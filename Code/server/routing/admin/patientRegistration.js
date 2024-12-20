const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const patientRegistrationController = require("../../controllers/admin/patientRegistration");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.id;
        const uploadDir = `imagingStudiesUploads/${userId}/imagingStudies`; // You can change this to your desired folder name

        // Create the "uploads" directory if it doesn't exist
        if (!fs.existsSync('imagingStudiesUploads')) {
            fs.mkdirSync('imagingStudiesUploads');
        }

        // Create the user's directory if it doesn't exist
        if (!fs.existsSync(`imagingStudiesUploads/${userId}`)) {
            fs.mkdirSync(`imagingStudiesUploads/${userId}`);
        }

        // Create the "imagingStudies" directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Get the file extension
        const fileExtension = path.extname(file.originalname).toLowerCase();
        // Check if the file extension is allowed
        if (['.doc', '.docx', '.pdf'].includes(fileExtension)) {
            const finalFilename = file.originalname;
            cb(null, finalFilename);
        }
        else {
            cb(new Error('File extension is not allowed'));
        }
    },
});

// Create a multer instance with the defined storage
const upload = multer({ storage: storage });


router.get('/api/get-registration-masterData', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientRegistrationController.getPatientRegistrationMasterData);
router.post('/api/post-patient-registration', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientRegistrationController.registerPatientProfile);
router.put('/api/post-patient-registration/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), upload.array('imagingStudies'), patientRegistrationController.uploadPatientFiles);
router.get('/api/get-patient-information/:currentBranch', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientRegistrationController.getPatientData);
router.put('/api/edit-patient-information/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), upload.array('imagingStudies'), patientRegistrationController.editPatient);
router.delete('/api/delete-patient-information/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientRegistrationController.deletePatient);


module.exports = router;