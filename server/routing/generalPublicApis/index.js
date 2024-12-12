const express = require('express');
const router = express.Router();
const controller = require("../../controllers/generalPublicApis/index");

router.post('/api/enquiry',  controller.post);

module.exports = router;