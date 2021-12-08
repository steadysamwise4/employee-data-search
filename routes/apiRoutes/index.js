const express = require('express');
const router = express.Router();

router.use(require('./departmentRoutes'));
router.use(require('./job_titleRoutes'));
module.exports = router;