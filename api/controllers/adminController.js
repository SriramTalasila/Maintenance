const mongoose = require("mongoose");
const md5 = require("md5");
const College = require('../models/college');
const Hostel = require('../models/hostel');
const Section = require('../models/section');

const User = require('../models/accounts/user');
const Staff = require('../models/accounts/staffProfile');
const Warden = require('../models/accounts/warden');

const send_mail = require('../controllers/functions/sendMail');

const Complaints = require('../models/complaint');
const Student = require('../models/accounts/studentProfile');
const Technicians = require('../models/technicians');

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
                    return res.status(500).json({ message: "Failed to add new Hostel" });
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
    Section.findOne({ name: req.body.name }, (er, resu) => {
        if (!resu) {
            const newSec = new Section({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name
            });
            newSec.save().then(result => {
                //console.log(result);
                return res.status(200).json({
                    message: "New section Added successful",
                });
            })
                .catch(error => {
                    return res.status(500).json({ message: "Failed to add new section" });
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

exports.get_complaints = (req, res, next) => {
    Complaints.find({isClosed:false},(err, result) => {
        if (result) {
            let hstls = {};
            Hostel.find({}, (er, docs) => {
                if (docs) {
                    docs.forEach(element => {
                        hstls[element._id] = element.name;
                    });
                    Technicians.find({}, (e, tdocs) => {
                        let techs = {};
                        if (tdocs) {
                            tdocs.forEach(element => {
                                techs[element._id] = { "name": element.name, "phone": element.phone };
                            });
                            return res.status(200).json({ "complaints": result, "hstls": hstls, "techs": techs });
                        }
                    })

                }
            })

        }
        if (err) {
            return res.status(500).json({ error: { message: "Failed to fetch data" } });
        }
    })
}

exports.add_warden = (req, res, next) => {
    User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] }, (ufer, ufres) => {
        if (!ufres) {
            var hash = md5(req.body.password);
            if (hash) {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    role: "warden",
                    isActive: true
                });
                newUser.save().then(re => {
                    const newwr = new Warden({
                        _id: new mongoose.Types.ObjectId(),
                        _staffid: re._id,
                        fullname: req.body.fname,
                        phone: req.body.phone,
                        hostel: req.body.hostel

                    })
                    newwr.save().then(nstres => {
                        sm(req.body.email);
                        return res.status(200).json({ success: { mssg: "New warden account created" } });
                    })
                })
                    .catch(uerr => {
                        return res.status(500).json({ error: { mssg: "Failed to create new warden account" } });
                    })

            }
            else {
                return res.status(500).json({ error: { mssg: "Failed to create new warden account" } });
            }

        }
        else {
            return res.status(409).json({ error: { mssg: "warden with same mail/username already exist" } });
        }
    })
}

exports.get_hostels = (req, res, next) => {
    Hostel.find({}, (err, docs) => {
        let hstls = {};
        if (docs) {
            docs.forEach(ele => {
                hstls[ele._id] = {
                    'name': ele.name
                }
            })
            return res.status(200).json({ 'format1': docs, 'format2': hstls });
        }
        else if (err) {
            return res.status(500).json({ 'error': 'Internal server error' });
        }
        else {
            return res.status(404).json({ 'error': 'no data found' });
        }
    })
}

exports.get_wardens = (req, res, next) => {
    User.find({ role: 'warden' }, 'username email isActive', (err, docs) => {
        if (docs) {
            return res.status(200).json(docs);
        }
        else if (err) {
            return res.status(500).json({ 'error': 'Internal server error' });
        }
        else {
            return res.status(404).json({ 'error': 'no data found' });
        }

    })
}

exports.get_cat = (req, res, next) => {
    Section.find({}, (err, docs) => {
        if (!err) {
            return res.status(200).json(docs);
        }
        else {
            return res.status(500).json({ "error": "Internal server error" });
        }
    })
}

exports.del_cat = (req, res, next) => {
    Section.findOneAndDelete({ _id: req.body.ctid }, (err, docs) => {
        if (!err) {
            return res.status(200).json({ "success": "deleted" });
        }
        else {
            return res.status(500).json({ "error": "unable to delete" });
        }
    })
}

exports.deactivate = (req, res, next) => {
    User.findOneAndUpdate({ _id: req.body.uid }, { $set: { isActive: false } }, (err, docs) => {
        if (!err) {
            return res.status(200).json({ "success": "Deactivated" });
        }
        else {
            return res.status(500).json({ "error": "Failed to deactivate" });
        }
    })
}

exports.activate = (req, res, next) => {
    User.findOneAndUpdate({ _id: req.body.uid }, { $set: { isActive: true } }, (err, docs) => {
        if (!err) {
            return res.status(200).json({ "success": "Activated" });
        }
        else {
            return res.status(500).json({ "error": "Failed to activate" });
        }
    })
}

exports.deleteuser = (req, res, next) => {
    User.findOneAndDelete({ _id: req.body.uid }, (err, docs) => {
        if (docs) {
            if (docs.role == 'Staff') {
                Staff.findOneAndDelete({ _staffid: docs._id }, (er, sdocs) => {
                    if (!er) {
                        return res.status(200).json({ "success": "deleted" })
                    }
                    else {
                        return res.status(500).json({ "error": "internal server error" });
                    }
                })
            }
            if (docs.role == 'student') {
                Student.findOneAndDelete({ _sid: docs._id }, (er, sdocs) => {
                    if (!er) {
                        return res.status(200).json({ "success": "deleted" })
                    }
                    else {
                        return res.status(500).json({ "error": "internal server error" });
                    }
                })
            }
            if (docs.role == 'warden') {
                Warden.findOneAndDelete({ _wid: docs._id }, (er, sdocs) => {
                    if (!er) {
                        return res.status(200).json({ "success": "deleted" })
                    }
                    else {
                        return res.status(500).json({ "error": "internal server error" });
                    }
                })
            }

        }
        else if (err) {
            return res.status(500).json({ "error": "internal server error" });
        }
    })
}

exports.search = (req, res, next) => {
    User.findOne({ username: req.body.username }, 'email username role isActive', (err, docs) => {
        if (!err && docs) {
            return res.status(200).json(docs);
        }
        else if (err) {
            return res.status(500).json({ "error": "Internal servver error" });
        }
        else {
            return res.status(404).json({ "error": "No data found" });
        }
    })
}

exports.get_colleges = (req, res, next) => {
    College.find({},(err,docs)=>{
        if(!err){
            return res.status(200).json(docs);
        }
        else if (err){
            return res.status(500).json({'error':'internal server error'});
        }
    })
}

exports.delete_college = (req, res, next) => {
    College.findOneAndDelete({_id:req.body.cid},(err,docs)=>{
        if(!err){
            return res.status(200).json({ "success": "deleted" })
        }
        else{
            return res.status(500).json({'error':'internal server error'});
        }
    })
}

exports.delete_hostel = (req, res,next)=>{
    Hostel.findOneAndDelete({_id:req.body.hid},(err,hdocs)=>{
        if(!err && hdocs){
            return res.status(200).json({ "success": "deleted" })
        }
        else{
            return res.status(500).json({'error':'internal server error'});
        }
    })
}