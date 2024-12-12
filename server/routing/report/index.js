const express = require('express');
const router = express.Router();
const controller = require("../../controllers/report");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const { USER_ROLE } = require('../../constant');

const allRoles = [USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]
router.get('/api/getPatients', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getPatients);
router.post('/api/report', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.postReport);
router.put('/api/report', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.putReport);
// router.get('/api/:pId/patient-appointments', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getPatientAppointments);
router.get('/api/:radiologyId/parent-patient', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getParentPatient);
router.get('/api/report/:reportId', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getReport);

router.get('/api/instance/:orthancStudyID', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getInstance);

router.get('/api/:orthancParentID/studies',verifyToken, roleChecker(["admin"]), checkCurrentBranch(),controller.getStudies);
router.get('/api/:orthancStudyID/images',verifyToken, roleChecker([...allRoles]), checkCurrentBranch(),controller.getImages);
router.get('/api/getSeniorRadiologistRequest', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getSeniorRadiologist);
router.post('/api/generateReportPDF', verifyToken, roleChecker([...allRoles]), checkCurrentBranch(), controller.generateReportPDF);

module.exports = router;