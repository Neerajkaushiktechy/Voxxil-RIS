const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const patientMedicalHistoryController = require("../../controllers/admin/patientMedicalHistory");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const { USER_ROLE } = require('../../constant');

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


router.post('/api/post-patient-medical-history', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientMedicalHistoryController.postPatientMedicalHistory);
router.put('/api/post-patient-medical-history/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), upload.array('imagingStudies'), patientMedicalHistoryController.uploadPatientFiles);

router.put('/api/edit-patient-medical-history/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), upload.array('imagingStudies'), patientMedicalHistoryController.editPatientMedicalHistory);


router.post('/api/post-patient-medical-images/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), upload.array('imagingStudies'), patientMedicalHistoryController.uploadPatientMedicalFiles);

module.exports = router;