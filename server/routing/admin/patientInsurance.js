const express = require('express');
const router = express.Router();
const patientInsuranceController = require("../../controllers/admin/patientInsurance");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-insurance', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientInsuranceController.postPatientInsurance);
router.put('/api/edit-patient-insurance/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientInsuranceController.editPatientInsurance);


module.exports = router;