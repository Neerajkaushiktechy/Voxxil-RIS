const express = require('express');
const router = express.Router();
const controller = require("../../controllers/verifySignature");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');

router.post('/api/appointer-signature', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.appointerSignature);

module.exports = router;