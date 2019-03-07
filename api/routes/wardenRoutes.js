const express = require('express');
const router = express.Router();
const multer = require('multer');
const wardenController = require('../controllers/wardenController');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/parents/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() +file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/addparent', upload.single('parentImage'),wardenController.add_parent);
router.post('/getparents', wardenController.get_parents);
router.get('/data', wardenController.get_data);
router.post('/deleteparent',wardenController.delete_parent);
module.exports = router;