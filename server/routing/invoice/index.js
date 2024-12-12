const express = require('express');
const router = express.Router();
const controller = require("../../controllers/invoice");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');
const { USER_ROLE } = require('../../constant')

router.get('/api/invoice/:type', verifyToken, roleChecker([USER_ROLE.patient,"admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getInvoice);

router.post('/api/postInvoice', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.postInvoice);

router.put('/api/updateInvoice', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.putInvoice);

module.exports = router;