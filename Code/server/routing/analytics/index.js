const express = require('express');
const router = express.Router();
const controller = require("../../controllers/analytics");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');

router.get('/api/getAnalyticsData/:month', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.get);

module.exports = router;