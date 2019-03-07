const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/addcollege', adminController.add_college);

router.post('/addhostel',adminController.add_hostel);

router.post('/addsection',adminController.add_section);

router.post('/addstaff',adminController.add_staff);

router.get('/getcomplaints',adminController.get_complaints);

router.get('/gethostels', adminController.get_hostels);

router.post('/addwarden', adminController.add_warden);

router.get('/getwardens' , adminController.get_wardens);

router.get('/getcategories',adminController.get_cat);

router.post('/deletecategory',adminController.del_cat);

router.post('/deactivateuser',adminController.deactivate);

router.post('/activate', adminController.activate);

router.post('/deleteuser',adminController.deleteuser);

router.post('/searchuser',adminController.search);

router.get('/getcolleges',adminController.get_colleges);

router.post('/deletecollege',adminController.delete_college);

router.post('/deletehostel',adminController.delete_hostel);

module.exports = router;