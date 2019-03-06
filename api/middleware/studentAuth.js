const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    try {
        console.log("aut");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secretkey');
        console.log(decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};