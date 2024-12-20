const express = require('express');
const router = express.Router();
const controller = require("../../controllers/radiology");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant')

const userRoles = Object.keys(USER_ROLE)

router.get('/api/profile-search', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.searchPatient);
router.post('/api/radiology', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.post);
router.get('/api/radiology', verifyToken, roleChecker([USER_ROLE.patient, "admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]), checkCurrentBranch(), controller.get);
router.get('/api/radiology/:id', verifyToken, roleChecker([USER_ROLE.patient, ...userRoles]), checkCurrentBranch(), controller.getById);
router.get('/api/radiology-appointment/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]), checkCurrentBranch(), controller.getRadiologyByAppointmentId);
router.put('/api/radiology', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.put);
router.delete('/api/radiology/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.delete);

module.exports = router;