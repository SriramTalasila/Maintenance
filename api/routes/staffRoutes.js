const express = require('express');
const router = express.Router();
const staffController= require('../controllers/staffController');

router.post('/addtechnician',staffController.add_technician);

router.post('/deletetechnician',staffController.delete_technician);

router.post('/assigntechnician',staffController.assign_technician);

router.get('/getcomplaints',staffController.get_complaints);

router.post('/closerequest',staffController.close_req);

router.get('/technicians',staffController.get_technicians);
module.exports = router;