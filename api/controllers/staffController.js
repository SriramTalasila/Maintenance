const mongoose = require("mongoose");
const staff = require('../models/accounts/staffProfile');
const Techician = require('../models/technicians');
const Complaint = require('../models/complaint');
const Hostel = require('../models/hostel');
const send_sms = require('../controllers/functions/sendMessage');
const User = require('../models/accounts/user');
const mailer = require('../controllers/functions/sendMail');

const sendMssg = (sdata ) => {
    Techician.findOne({ _id: sdata.techid }, 'phone', (er, data) => {
        console.log()
        Hostel.findOne({ _id: sdata.docs.hostel }, (e, hdata) => {
            send_sms.send_sms({
                phone: data.phone,
                text: "Location" + sdata.docs.location + " in " + hdata.name + " hostel" + sdata.docs.title + ""
            })
        })
    })
}

const studentMail = (data)=>{
    User.findOne({_id:data.sid},'email',(err,result)=>{
        mailer.send_mail({
            email:result.email,
            sub:'Complaint Resolved',
            body:'The complaint you raised on '+data.ondate+' resolved successfully'
        },(er,re)=>{
            console.log(err || re);
        })
    })

}
exports.add_technician = (req, res, next) => {
    //console.log(req.body.staffid);
    staff.findOne({ _staffid: req.body.staffid }, (err, docs) => {
        //console.log(docs);
        if (docs) {
            const newTech = new Techician({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                phone: req.body.phone,
                section: docs.section
            });
            newTech.save().then(result => {
                return res.status(200).json({ success: { message: "New technician added successfully" } });
            }).catch(err => {
                return res.status(500).json({ error: { message: "Fail to add new technician" } });
            })
        }
        else {
            console.log(err);
            return res.status(500).json({ error: { message: "Fail to find staff member" } });
        }
    })

}

exports.delete_technician = (req, res, next) => {
    Techician.deleteOne({ _id: req.body.tid }, (err) => {
        if (err)
            return res.status(500).json({ error: { message: "failed to delete technician" } });
        else
            return res.status(200).json({ success: { message: "Technician added successfully" } });
    })
}

exports.assign_technician = (req, res, next) => {
    //console.log(req.body.comid+"   "+ req.body.techid);
    Complaint.findOneAndUpdate({ _id: req.body.comid }, { $set: { technician: req.body.techid, status: "Assigned a technician" } }, (er, docs) => {
        //console.log(docs);
        if (er) {
            console.log(er);
            return res.status(500).json({ error: { message: "failed to assign technician" } })
        }
        else {
            sendMssg({ docs: docs, techid: req.body.techid });
            return res.status(200).json({ success: { message: "technician assigned" } })
        }
    })
}

exports.close_req = (req, res, next) => {
    Complaint.findOneAndUpdate(
        {_id:req.body.comid},
        {
            isClosed:true,
            feedback:req.body.feedback,
            status:"closed"   
        },(er,dtdocs)=>{
            if(dt){
                studentMail(dtdocs);
                return res.status(200).json({success:{message:"Complaint closed successfully"}});
            }
            else{
                return res.status(500).json({error:{message:"Failed to close complaint"}});
            }
        })
}