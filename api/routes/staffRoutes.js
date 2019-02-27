const express = require('express');
const router = express.Router();
const staffController= require('../controllers/staffController');

router.post('/addtechnician',staffController.add_technician);

router.delete('/deletetechnician',staffController.delete_technician);

router.post('/assigntechnician',staffController.assign_technician);
module.exports = router;