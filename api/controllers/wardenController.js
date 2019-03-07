const mongoose = require("mongoose");
const Parent = require('../models/parent');
const User = require('../models/accounts/user');
const Student = require('../models/accounts/studentProfile');
const Colleges = require('../models/college');
const Hostel = require('../models/hostel');
const fs = require('fs');

exports.add_parent = (req, res, next) => {
    console.log(req.file);
    User.findOne({ username: req.body.sroll }, (err, sdocs) => {
        console.log(sdocs);
        if (sdocs) {
            const par = new Parent({
                _id: new mongoose.Types.ObjectId(),
                _sid: sdocs._id,
                srollNo: req.body.sroll,
                fullname: req.body.fname,
                relation: req.body.relation,
                email: req.body.email,
                photo: req.file.filename,
                phone: req.body.phone
            });
            par.save().then(resl => {
                return res.status(200).json({ 'success': 'Successfully saved' });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ 'error': 'Failed to save data' });
            })
        }
        else {
            return res.status(404).json({ 'error': 'student not found' });
        }
    });
}

exports.get_parents = (req, res, next) => {
    console.log(req.body.sroll);
    Student.findOne({ rollno: req.body.sroll }, (err, sdocs) => {
        if (sdocs) {
            Parent.find({ srollNo: sdocs.rollno }, (er, pdocs) => {
                return res.status(200).json({ "student": sdocs, 'parents': pdocs })
            })
        } else {
            return res.status(404).json({ 'error': 'student not found' });
        }
    })
}

exports.get_data = (req, res, next) => {
    Hostel.find({}, (err, hdocs) => {
        if (hdocs) {
            let hstls = {};
            hdocs.forEach(ele => {
                hstls[ele._id] = {
                    'name': ele.name
                }
            })
            Colleges.find({}, (er, cdocs) => {
                if (!er) {
                    let clg = {};
                    cdocs.forEach(elem => {
                        clg[elem._id] = {
                            'name': elem.name
                        }
                    })
                    return res.status(200).json({"hostels":hstls,"colleges":clg});
                }
                else{
                    return res.status(500).json({"error":'Internal server error'});
                }
            })
        }
        else{
            return res.status(500).json({"error":'Internal server error'})
        }
    })
}

exports.delete_parent = (req, res, next) => {
    Parent.findOneAndDelete({_id:req.body.pid},(er,docs)=>{
        if(docs){
            console.log(docs);
            fs.unlink('./public/parents/'+docs.photo,()=>{
                res.status(200).json({'success':'Deleted parent'});
            })
        }
        if(er){
            res.status(500).json({'error':'Failed to delete parent'});
        }
    })
}