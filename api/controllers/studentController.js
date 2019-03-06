const mongoose = require("mongoose");
const Complaint = require('../models/complaint');

const User = require('../models/accounts/user');
const Student = require('../models/accounts/studentProfile');
const Staff = require('../models/accounts/staffProfile');
const mailer = require('../controllers/functions/sendMail');
const sms = require('../controllers/functions/sendMessage');
const Hostel = require('../models/hostel');
const Technicians = require('../models/technicians');
const college = require('../models/college');

const sendToStaff = (data) => {
    mailer.send_mail({
        email: data.email,
        sub: "A new complaint request has raised",
        body: '<h3>New Complaint</h3><p><b>Title :</b>' + data.com.title + '</p></br><p><b>Description :</b>' + data.com.description + '</p>'
    }, (err, res) => {
        console.log(err);
        if(res)
            console.log("mail send to staff")
    })
}

const sendIntMail = (data) => {
    console.log(data);
    Staff.find({ section: data.sectionid }, '_staffid', (err, docs) => {
        if (err)
            console.log(err);
        if (docs) {
            for (i = 0; i < docs.length; i++) {
                console.log(docs[i]._staffid);
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

const sendMssg = (data) => {

}

exports.make_compliant = (req, res, next) => {
    console.log(req.userData);

    Student.findOne({ _sid: req.userData.userId }, 'hostel', (er, sdocs) => {
        if (sdocs) {
            const newCom = new Complaint({
                _id: new mongoose.Types.ObjectId(),
                sid: req.userData.userId,
                title: req.body.title,
                description: req.body.description,
                location: req.body.location,
                section: req.body.section,
                hostel: sdocs.hostel,
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
        else {
            console.log("failed to fetch student data")
            return res.status(500).json({ error: { message: "Unable to register complaint" } })
        }
    })

}

exports.cancel_complaint = (req, res, next) => {
    console.log('hello');
    Complaint.findOneAndDelete({ _id: req.body.comid, sid: req.userData.userId }, (err, docs) => {
        if (err)
            return res.status(500).json({ error: { message: "unable to cancel complaint request" } });
        else {
            if (docs.technician) {
                sendMssg(docs);
            }
            return res.status(200).json({ success: { message: "Canceled Succesfully" } });
        }
    })
}

exports.getst_complaints = (req, res, next) => {
    Complaint.find({ sid: req.userData.userId }, (err, result) => {
        if (result) {

            Technicians.find({}, (e, tdocs) => {
                let techs = {};
                if (tdocs) {
                    tdocs.forEach(element => {
                        techs[element._id] = { "name": element.name, "phone": element.phone };
                    });
                    return res.status(200).json({ "complaints": result, "techs": techs });
                }
                if (err) {
                    return res.status(500).json({ error: { message: "Failed to fetch data" } });
                }
            })
        }
        if (err) {
            return res.status(500).json({ error: { message: "Failed to fetch data" } });
        }
    })
}

exports.st_feedback = (req, res, next) => {
    Complaint.findOneAndUpdate({ _id: req.body.comId }, { $set: { stufeedback: req.body.fdata } }, (err, docs) => {
        if (docs) {
            return res.status(200).json({ success: { message: 'Feedback submitted succesfully' } });
        }
        else if (!docs) {
            return res.status(404).json({ error: { message: 'complaint Not found' } });
        }
        else if (err)
            return res.status(500).json({ error: { message: 'Unable to store feedback' } });
    })
}

exports.mydata = (req, res, next) => {
    Student.findOne({ _sid: req.userData.userId }, (err, docs) => {
        if (docs) {
            Hostel.findOne({ _id: docs.hostel }, (herr, hdocs) => {
                if (hdocs) {

                    college.findOne({ _id: docs.college }, (cerr, cdocs) => {
                        if (cdocs) {
                            return res.status(200).json({"student":docs,"hstl":hdocs,"clg":cdocs});
                        }
                        else
                            return res.status(500).json({ error: { message: "unable to fetch data" } });
                    })

                }
                else
                    return res.status(500).json({ error: { message: "unable to fetch data" } });
            })
        }
        else if (err) {
            return res.status(404).json({ error: { message: "data not found" } });
        }
        else
            return res.status(500).json({ error: { message: "unable to fetch data" } });
    })
}