const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

router.post('/makecomplaint', studentController.make_compliant);

router.delete('/cancelcomplaint',studentController.cancel_complaint);


module.exports = router;