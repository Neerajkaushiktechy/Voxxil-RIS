const express = require('express');
const router = express.Router();
const patientLifeStyleInfoController = require("../../controllers/admin/patientLifeStyleInfo");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-lifeStyle', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientLifeStyleInfoController.postPatientLifeStyleInfo);
router.put('/api/edit-patient-lifeStyle/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientLifeStyleInfoController.editPatientLifeStyleInfo);


module.exports = router;