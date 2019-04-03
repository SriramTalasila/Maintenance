const mongoose = require("mongoose");
const staff = require('../models/accounts/staffProfile');
const Techician = require('../models/technicians');
const Complaint = require('../models/complaint');
const Hostel = require('../models/hostel');
const send_sms = require('../controllers/functions/sendMessage');
const User = require('../models/accounts/user');
const mailer = require('../controllers/functions/sendMail');

const sendMssg = (sdata) => {
    Techician.findOne({ _id: sdata.techid }, 'phone', (er, data) => {
        //console.log(sdata.docs.hostel);
        Hostel.findOne({ _id: sdata.docs.hostel}, (e, hdata) => {
            if(hdata){
            send_sms.send_sms({
                phone: data.phone,
                text: "You are assigned to a complaint at Location" + sdata.docs.location + " in " + hdata.name + " hostel (" + sdata.docs.title + ")"
            })
            }
            else{
                console.log("Some data not found");
            }
        })
    })
}

const studentMail = (data) => {
    User.findOne({ _id: data.sid }, 'email', (err, result) => {
        mailer.send_mail({
            email: result.email,
            sub: 'Complaint closed',
            body: 'The complaint you raised on ' + data.ondate + ' resolved successfully'
        }, (er, re) => {
            console.log(err || re);
        })
    })

}
exports.add_technician = (req, res, next) => {
    //console.log(req.body.staffid);
    staff.findOne({ _staffid: req.userData.userId }, (err, docs) => {
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
            //console.log(err);
            return res.status(500).json({ error: { message: "Fail to find staff member" } });
        }
    })

}

exports.delete_technician = (req, res, next) => {
   //console.log(req.body.tid);
    Techician.deleteOne({ _id: req.body.tid }, (err) => {
        if (err)
            return res.status(500).json({ error: { message: "failed to delete technician" } });
        else
            return res.status(200).json({ success: { message: "Technician deleted successfully" } });
    })
}

exports.assign_technician = (req, res, next) => {
    //console.log(req.body.comid+"   "+ req.body.techid);
    Complaint.findOneAndUpdate({ _id: req.body.comid }, { $set: { technician: req.body.techid, status: "Assigned a technician" } }, (er, docs) => {
        //console.log(docs);
        if (er) {
            //console.log(er);
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
        { _id: req.body.comid },
        {
            isClosed: true,
            feedback: req.body.feedback,
            status: "closed"
        }, (er, dtdocs) => {
            if (dtdocs) {
                studentMail(dtdocs);
                return res.status(200).json({ success: { message: "Complaint closed successfully" } });
            }
            else {
                return res.status(500).json({ error: { message: "Failed to close complaint" } });
            }
        })
}

exports.get_complaints = (req, res, next) => {
    staff.findOne({ _staffid: req.userData.userId ,isClosed:false}, 'section', (err, sdocs) => {
        if (sdocs) {
            Complaint.find({ section: sdocs.section }, (cer, cdocs) => {
                Hostel.find({}, (er, docs) => {
                    if (docs) {
                        let hstls = {}
                        docs.forEach(element => {
                            hstls[element._id] = element.name;
                        });
                        Techician.find({}, (e, tdocs) => {
                            let techs = {};
                            if (tdocs) {
                                tdocs.forEach(element => {
                                    techs[element._id] = { "name": element.name, "phone": element.phone };
                                });
                                return res.status(200).json({ "complaints": cdocs, "hstls": hstls, "techs": techs });
                            }
                        })

                    }
                })
            })
        }
        else {
            return res.status(404).json({ 'error': 'Unable to fetch details' })
        }
    })
}

exports.get_technicians = (req, res, next) =>{
    staff.findOne({ _staffid: req.userData.userId }, 'section', (err, sdocs) => {
        if(sdocs){
            Techician.find({secion:sdocs.section}, (e, tdocs) => {
                return res.status(200).json(tdocs);
            })
        }
        else{
            return res.status(404).json({ 'error': 'Unable to fetch details' })
        }
    })

    
}