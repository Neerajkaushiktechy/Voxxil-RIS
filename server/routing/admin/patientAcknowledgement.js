const express = require('express');
const router = express.Router();
const patientAcknowledgementController = require("../../controllers/admin/patientAcknowledgement");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant');



router.post('/api/post-patient-acknowledgement', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientAcknowledgementController.postpatientAcknowledgement);
router.put('/api/edit-patient-acknowledgement/:id', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), patientAcknowledgementController.editpatientAcknowledgement);

module.exports = router;