const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var async = require("async");

const User = require("../models/accounts/user");
const otp = require('../models/accounts/otp');

const helperFun = require('./functions/stCreate');
const send_mail = require('./functions/sendMail')

exports.user_login = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "secretkey",
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


//Call st_user for every user
const forUser = function (args, callback) {
  for (i = 0; i < args.length; i++) {
    helperFun.st_create(args[i])
  }
  callback(null, "success")
}


/* bulk Student Creation route controller */
exports.student_create = (req, res, next) => {
  var stData = req.body.stdata;
  forUser(stData, (err, result) => {
    if (err) console.log('ERROR', err);
    console.log(result);
    res.status(200).json({ 'result': result });
  });

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
            "body": "<p><b>"+otdocs.otp + "</b> is the one-time password to reset your password</p>"
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
                    res.status(500).json({ 'error': { 'message': 'Mail to send OTP' } });
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

// end  of otp route


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
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              User.update({ _id: docs._id }, { password: hash }, (er, up) => {
                if (er) {
                  res.status(500).json({ "error": "unable to reset password" });
                }
                else {
                  console.log(up);
                  res.status(200).json({ "success": "Password reset successfully" });
                  otp.deleteOne({ _id: otdocs._id }, (erro, dres) => { console.log('delted otp'); })
                }
              })
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