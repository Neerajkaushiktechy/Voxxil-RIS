const express = require('express');
const router = express.Router();
const controller = require("../../controllers/appointment");
const roleChecker = require('../../middleware/roleChecker');
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
router.get('/api/appointment', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.get);
module.exports = router;