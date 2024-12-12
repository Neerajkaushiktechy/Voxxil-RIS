const express = require('express');
const router = express.Router();
const controller = require("../../controllers/modality");
const verifyToken = require('../../middleware/tokenVerify');
const roleChecker = require('../../middleware/roleChecker');

router.post('/api/modality', verifyToken, roleChecker(["admin"]), controller.post);
router.get('/api/modality', verifyToken, roleChecker(["admin", "juniorRadiologist", "seniorRadiologist"]), controller.get);
router.put('/api/modality', verifyToken, roleChecker(["admin"]), controller.put);
router.delete('/api/modality/:id', verifyToken, roleChecker(["admin"]), controller.delete);

module.exports = router;