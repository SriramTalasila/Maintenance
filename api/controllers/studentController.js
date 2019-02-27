const mongoose = require("mongoose");
const Complaint = require('../models/complaint');

const User = require('../models/accounts/user');
const Student = require('../models/accounts/studentProfile');
const Staff = require('../models/accounts/staffProfile');
const mailer = require('../controllers/functions/sendMail');
const sms = require('../controllers/functions/sendMessage');

const sendToStaff = (data) => {
    mailer.send_mail({
        email: data.email,
        sub: "A new complaint request has raised",
        body: '<h3>New Complaint</h3><p><b>Title :</b>' + data.com.title + '</p></br><p><b>Description :</b>' + data.com.description + '</p>'
    }, (err, res) => {
        console.log(err);
    })
}

const sendIntMail = (data) => {
    console.log(data);
    Staff.find({ section: data.sectionid }, '_staffid', (err, docs) => {
        if (err)
            console.log(err);
        if (docs) {
            for (i = 0; i < docs.length; i++) {
                User.findOne({ _id: docs[i]._staffid }, 'email', (err, res) => {
                    sendToStaff({ email: res.email, com: data.robj })
                })
            }
        }
    });
    User.findOne({ _id: data.stid }, 'email', (err, docs) => {
        mailer.send_mail({ email: docs.email, sub: "Complaint Registered Successfully", body: "your complaint toward " + data.titl + " is registered  sucesfully" }, (err, s) => {
            if (err)
                console.log(err);
            else
                console.log("intimation mail sent to student");
        })
    })


}

const sendMssg = (data)=>{
    
}

exports.make_compliant = (req, res, next) => {
    const newCom = new Complaint({
        _id: new mongoose.Types.ObjectId(),
        sid: req.body.sid,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        section: req.body.section,
        hostel: req.body.hostel,
        status: "initiated"
    });
    newCom.save().then(result => {
        sendIntMail({ stid: result.sid, titl: result.title, sectionid: result.section, robj: result, });
        return res.status(200).json({ success: { message: "Complaint registered" } })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: { message: "Unable to register complaint" } })
    })

}

exports.cancel_complaint = (req, res, next) => {
    Complaint.findOneAndDelete({_id:req.body.comid,sid:req.body.stid},(err,docs)=>{
        if(err)
            return res.status(500).json({error:{message:"unable to cancel complaint request"}});
        else{
            if(docs.technician){
                    sendMssg(docs);
            }
            return res.status(200).json({success:{message:"Canceled Succesfully"}});
        }
    })
}