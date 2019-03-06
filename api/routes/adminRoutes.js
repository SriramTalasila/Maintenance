const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/addcollege', adminController.add_college);

router.post('/addhostel',adminController.add_hostel);

router.post('/addsection',adminController.add_section);

router.post('/addstaff',adminController.add_staff);

router.get('/getcomplaints',adminController.get_complaints);

router.get('/gethostels', );

router.post('/addwarden');

module.exports = router;