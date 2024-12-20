const express = require('express');
const router = express.Router();
const patientEmergencyContactController = require("../../controllers/admin/patientEmergencyContactInfo");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-emergencyContact', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientEmergencyContactController.postPatientEmergencyContact);
router.put('/api/edit-patient-emergencyContact/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientEmergencyContactController.editPatientEmergencyContact);


module.exports = router;