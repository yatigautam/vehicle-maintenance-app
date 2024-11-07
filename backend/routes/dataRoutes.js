const express = require('express');
const router = express.Router();
const { getData, addData, checkRisk } = require('../controllers/dataController');

router.get('/data', getData);
router.post('/data', addData);
router.get('/risk', checkRisk);

module.exports = router;
