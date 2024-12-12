const express = require('express');
const router = express.Router();
const controller = require("../../controllers/exam");
const verifyToken = require('../../middleware/tokenVerify');
const checkCurrentBranch = require('../../middleware/checkCurrentBranch');
const roleChecker = require('../../middleware/roleChecker');

router.post('/api/exam-group', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.postGroup);
router.get('/api/exam-group-id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getGroupById);
router.get('/api/exam-group', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getGroup);
router.put('/api/exam-group', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.putGroup);
router.delete('/api/exam-group/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.deleteGroup);

router.post('/api/exam-list', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.postList);
router.get('/api/exam-list', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), checkCurrentBranch(), controller.getList);
router.put('/api/exam-list', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.putList);
router.delete('/api/exam-list/:id', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.deleteList);

module.exports = router;

