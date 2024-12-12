const express = require('express');
const router = express.Router();
const patientInformationController = require("../../controllers/admin/patientInformation");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-information', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), patientInformationController.postPatientInformation);
router.put('/api/put-patient-information/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientInformationController.editPatientInformation);

module.exports = router;