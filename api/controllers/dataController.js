const mongoose = require("mongoose");
const Hostel = require('../models/hostel');
const User = require('../models/accounts/user');
const College = require('../models/college');
const Section = require('../models/section');
const Students = require('../models/accounts/studentProfile');
const Parents = require('../models/parent');

exports.get_hostels = (req, res, next) => {
    Hostel.find({}, 'name', (err, docs) => {
        return res.status(200).json(docs);

    })

}
exports.get_colleges = (req, res, next) => {

    College.find({}, 'name', (er, resu) => {
        return res.status(200).json(resu);
    })

}

exports.get_sections = (req, res, next) => {

    Section.find({}, 'name', (er, resu) => {
        return res.status(200).json(resu);
    })

}

exports.get_role = (req, res, next) => {
    console.log(req.userData);
    User.findOne({_id:req.userData.userId},'role',(err,docs)=>{
        console.log(docs)
        if(docs){
            return res.status(200).json({success:{role:docs.role}});
        }
        else{
            return res.status(401).json({error:{mssg:"not found"}});
        }
    })
}

exports.get_data = (req,res,next) => {
    var std = req.body.rollno;
    console.log(std);
    Students.findOne({rollno:std},(err,sdocs)=>{
        if(sdocs){
            Parents.find({srollNo:std},(er,pdocs)=>{
                Hostel.find({},(e,hdocs)=>{
                    let hstls = {}
                    hdocs.forEach(ele => {
                        hstls[ele._id] = ele
                    })
                    College.find({},(ce,cdocs)=>{
                        let clgs = {};
                        cdocs.forEach(elem=>{
                            clgs[elem._id] = elem
                        })
                        return res.status(200).json({'student':sdocs,'guardians':pdocs,'colleges':clgs,'hostels':hstls});
                    })
                })
            })
        }
        else{
            return res.status(404).json({'error':'student not found'})
        }
    })

}