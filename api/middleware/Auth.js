const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //console.log("aut");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secretkey');
        //console.log(decoded);
        if(decoded.role == 'Admin'){
            req.userData = decoded;
            next();
        }
        else{
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
