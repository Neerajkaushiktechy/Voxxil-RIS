const express = require('express');
const router = express.Router();
const controller = require("../../controllers/dashboard");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');

router.get('/api/allAppointments', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]), checkCurrentBranch(), controller.get);
router.get('/patient/api/dashboard', verifyToken, roleChecker(["Patient"]), checkCurrentBranch(), controller.getPatientDashboardData);

module.exports = router;