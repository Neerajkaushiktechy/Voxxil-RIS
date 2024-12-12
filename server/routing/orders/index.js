const express = require('express');
const router = express.Router();
const controller = require("../../controllers/orders");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');

const allRoles = ["admin", "juniorRadiologist", "seniorRadiologist", "cardiothoracicRadiology", "sonographer", "radiologist", "mriTechnologist", "nuclearRadiology", "ctTechnologist", "mammographer", "cardiovascularTechnologist", "pediatricRadiology", "cardiothoracicRadiology", "interventionalRadiology", "neuroradiology", "radiographicAssistant", "gastrointestinalRadiology", "genitourinaryRadiology", "medicalImagingProfessions", "medicalPhysicist", "musculoskeletalRadiology"]

router.get('/api/orders/:value/:elm', verifyToken, roleChecker([...allRoles]), checkCurrentBranch(), controller.get);
router.get('/api/order/:id', verifyToken, roleChecker([...allRoles]), checkCurrentBranch(), controller.getId);
router.get('/api/patient-orders/:id', verifyToken, roleChecker([...allRoles]), checkCurrentBranch(), controller.getPatientOrders);
router.put('/api/order-status', verifyToken, roleChecker([...allRoles]), controller.putOrderStatus);

module.exports = router;