const mongoose = require("mongoose");
const md5 = require("md5");
const College = require('../models/college');
const Hostel = require('../models/hostel');
const Section = require('../models/section');

const User = require('../models/accounts/user');
const Staff = require('../models/accounts/staffProfile');

const send_mail = require('../controllers/functions/sendMail');

//Sending mail to staff after creating account
const sm = (stemail) => {
    send_mail.send_mail({
        email: stemail,
        sub: "Account creation Notification",
        body: "Your account has been created"
    }, (err, result) => {
        if (result)
            console.log(result);
        else
            console.log(result);
    })
}

//route to create new college  from admin
exports.add_college = (req, res, next) => {
    const newCollege = new College({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.cname
    });
    newCollege.save().then(result => {
        return res.status(200).json({
            message: "College Added successful",
        });
    })
        .catch(err => {
            return res.status(500).json(err);
        })
}

//route to create  new hostel from admin
exports.add_hostel = (req, res, next) => {
    Hostel.findOne({ name: req.body.hname }, (er, re) => {
        if (!re) {
            const newHostel = new Hostel({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.hname,
                hstltype: req.body.hstltype,
                location: req.body.location
            });
            newHostel.save().then(result => {
                //console.log(result);
                return res.status(200).json({
                    message: "Hostel Added successful",
                });
            })
                .catch(error => {
                    return res.status(500).json({ err: "Failed to add new Hostel" });
                })
        }
        else {
            return res.status(409).json({
                message: "Hostel with same Name Already exits"
            })
        }
    })

}

//route to create new section  from admin
exports.add_section = (req, res, next) => {
    Section.findOne({ name: req.body.sname }, (er, resu) => {
        if (!resu) {
            const newSec = new Section({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.sname
            });
            newSec.save().then(result => {
                //console.log(result);
                return res.status(200).json({
                    message: "New section Added successful",
                });
            })
                .catch(error => {
                    return res.status(500).json({ err: "Failed to add new section" });
                })
        }
        else {
            return res.status(409).json({
                message: "section with same name Already exits"
            })
        }
    })

}


//route to create  new staff member from admin
exports.add_staff = (req, res, next) => {
    User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] }, (ufer, ufres) => {
        if (!ufres) {
            var hash = md5(req.body.password);
            if (hash) {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    role: "Staff",
                    isActive: true
                });
                newUser.save().then(re => {
                    const newSt = new Staff({
                        _id: new mongoose.Types.ObjectId(),
                        _staffid: re._id,
                        fullname: req.body.fname,
                        phone: req.body.phone,
                        section: req.body.section

                    })
                    newSt.save().then(nstres => {
                        sm(req.body.email);
                        return res.status(200).json({ success: { mssg: "New Staff account created" } });
                    })
                })
                    .catch(uerr => {
                        return res.status(500).json({ error: { mssg: "Failed to create new staff account" } });
                    })

            }
            else {
                return res.status(500).json({ error: { mssg: "Failed to create new staff account" } });
            }

        }
        else {
            return res.status(409).json({ error: { mssg: "Staff with same mail/username already exist" } });
        }
    })
}