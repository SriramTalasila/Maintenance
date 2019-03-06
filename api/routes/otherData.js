const express = require('express');
const router = express.Router();

const authMidd = require('../middleware/Auth');

const dataController = require('../controllers/dataController');

router.get('/gethostels',dataController.get_hostels);
router.get('/getcolleges',dataController.get_colleges);
router.get('/getsections',dataController.get_sections);
router.post('/checkrole', authMidd, dataController.get_role);

module.exports = router;