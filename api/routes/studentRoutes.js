const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');

router.post('/makecomplaint', studentController.make_compliant);

router.post('/cancelcomplaint',studentController.cancel_complaint);

router.get('/viewcomplaints',studentController.getst_complaints);

router.post('/feedback',studentController.st_feedback);

router.get('/mydata',studentController.mydata);


module.exports = router;