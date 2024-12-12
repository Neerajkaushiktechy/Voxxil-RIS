const express = require('express');
const router = express.Router();
const patientPhysicianController = require("../../controllers/admin/patientPhysician");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-physician', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientPhysicianController.postPatientPhysician);
router.put('/api/edit-patient-physician/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientPhysicianController.editPatientPhysician);


module.exports = router;