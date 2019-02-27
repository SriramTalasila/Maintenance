const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

//model imports 
const User = require("../models/accounts/user");
const otp = require('../models/accounts/otp');
const Student = require('../models/accounts/studentProfile');
const Mailvf = require('../models/accounts/mailv');

//helper function mports
const send_mail = require('./functions/sendMail')
const gen_tkn = require('./functions/actToken');

//Route to send jwt token
exports.user_login = (req, res, next) => {
  User.findOne({ username: req.body.username }, (err, Usdocs) => {
    if (Usdocs) {
      console.log(req.body.password);
      console.log(Usdocs.password);
      var hash = md5("12345678");
      console.log(hash);
      if (hash == Usdocs.password)
        console.log(hash + "  " + Usdocs.password);
      if (hash == Usdocs.password) {
        //console.log(hash+"  "+Usdocs.password);
        if (Usdocs.isActive) {
          const token = jwt.sign(
            {
              email: Usdocs.email,
              userId: Usdocs._id
            },
            "secretkey",
            {
              expiresIn: "24h"
            }
          );
          return res.status(200).json({
            success: {
              message: "Auth successful",
              role: Usdocs.role,
              token: token
            }
          });
        }

        else {
          return res.status(401).json({ error: { message: "Please activate your account" } });
        }
      }
      else
        return res.status(401).json({ error: { message: "Username password mismatch" } });
    }
    else {
      return res.status(401).json({ error: { message: "Incorrect username" } });
    }

  })
};

//Sign up student or register user
exports.user_signup = (req, res, next) => {
  User.findOne({ email: req.body.email }, (er, resu) => {
    if (!resu) {
      var hash = md5(req.body.password);
      console.log(hash);
      if (hash) {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          username: req.body.regno,
          password: hash,
          role: "student"
        });
        newUser.save().then(re => {
          const newstProfile = new Student({
            _id: new mongoose.Types.ObjectId(),
            _sid: re._id,
            fullname: req.body.fname,
            rollno: req.body.regno,
            college: req.body.cid,
            hostel: req.body.hid,
            room: req.body.rm
          })
          newstProfile.save().then(r => {
            gen_tkn.gen_token({ uid: re._id, email: re.email }, (eror, reul) => {
              if (reul) {
                return res.status(200).json({ success: { mssg: "Activation link sent to your mail" } });
              }
              else {
                return res.status(500).json({ error: { mssg: "failed to create student account" } });
              }
            })
          })
            .catch(er1 => {
              return res.status(500).json({ error: { mssg: "failed to create student account" } });
            })
        })
          .catch(e => {
            return res.status(500).json({ error: { mssg: "failed to create student account" } });
          })
      }

    }
    else {
      return res.status(409).json({ error: { mssg: "Account already exists with given mail" } });
    }
  })
}

// Route to  send reset otp to user mail and saves the otp in database for later verification
exports.send_mail = (req, res, next) => {
  User.findOne({ username: req.body.username }, function (err, docs) {
    if (err)
      res.status(404).json({ "error": "Unable to find username" });
    else if (docs) {
      console.log(docs._id);
      otp.findOne({ user_id: docs._id }, function (er, otdocs) {
        if (otdocs) {
          send_mail.send_mail({
            "email": docs.email,
            "sub": "OTP to reset your password",
            "body": "<p><b>" + otdocs.otp + "</b> is the one-time password to reset your password</p>"
          },
            (error, mresult) => {
              if (error) {
                res.status(500).json({ 'error': { 'message': 'unable to Mail OTP' } });
              }
              else
                res.status(200).json({ 'success': { 'message': 'One time password sent to your mail' } });
            }
          );
        }
        else {
          var number = Math.floor((Math.random() * 20000) + 10000);
          const ot = new otp({
            _id: new mongoose.Types.ObjectId(),
            user_id: docs._id,
            otp: number
          });
          ot.save()
            .then(result => {
              send_mail.send_mail({
                "email": docs.email,
                "sub": "OTP to reset your password",
                "body": number + " is the one-time password to reset your password"
              },
                (error, mresult) => {
                  if (error) {
                    res.status(500).json({ 'error': { 'message': 'unable to Mail OTP' } });
                  }
                  else
                    res.status(200).json({ 'success': { 'message': 'One time password sent to your mail' } });
                }
              );
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
      })

    }
    else {
      res.status(404).json({ "error": "unable to  find username" });
    }
  });
}

//Route to reset password using otp
exports.rest_password = (req, res, next) => {
  User.findOne({ username: req.body.username }, function (err, docs) {
    if (err)
      res.status(404).json({ "error": "Unable to find username" });
    else {
      otp.findOne({ user_id: docs._id }, (err, otdocs) => {
        if (err)
          res.status(500).json({ "error": "unable to get details" });
        else if (otdocs) {
          if (otdocs.otp == req.body.otp) {
            var hash = md5(req.body.password);
            User.update({ _id: docs._id }, { password: hash }, (er, up) => {
              if (er) {
                res.status(500).json({ "error": "unable to reset password" });
              }
              else {
                console.log(up);
                res.status(200).json({ "success": "Password reset successfully" });
                otp.findOneAndDelete({ _id: otdocs._id }, (erro, dres) => { console.log('delted otp'); })
              }
            })
          }

          else
            res.status(404).json({ "error": "otp not matching" });
        }
        else
          res.status(500).json({ "error": "unable to reset password" });
      })
    }
  });
}

// verify mail 
exports.user_verify = (req, res, next) => {
  var key = req.query.token;
  var usid = req.query.id;
  console.log(key + "    " + usid)
  Mailvf.findOne({ uid: usid }, (err, result) => {
    if (result) {
      User.findOneAndUpdate({ _id: usid }, { $set: { isActive: true } }, { new: true }, (err1, doc) => {
        if (err1) {
          return res.send("Unable to activate your account contact admin");
        }
        else {
          return res.send("<Center>Your account is Active</center>");
        }
      }
      )
      Mailvf.findOneAndDelete({ uid: usid }, (mer, mdre) => {
      })
    }
    else {
      return res.send("<Center>Invalid Link</center>")
    }
  })
}