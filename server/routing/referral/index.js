const express = require('express');
const router = express.Router();
const controller = require("../../controllers/referral");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');


router.post('/api/referral', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.post);
router.get('/admin/api/get-referral-list', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getReferralList);
router.put('/admin/api/approve-referral', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.approveReferral);
router.put('/admin/api/decline-referral', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.declineReferral);
router.get('/admin/api/get-decline-list', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]), checkCurrentBranch(), controller.declineReferralList);

module.exports = router;