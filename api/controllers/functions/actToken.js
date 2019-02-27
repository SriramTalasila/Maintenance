const mongoose = require("mongoose");
const rtg = require('random-token-generator');
const Mailvf = require('../../models/accounts/mailv'); 
const sendMail = require('./sendMail');

exports.gen_token = (userData, callback) => {
    rtg.generateKey({
        len: 16,
        string: true,
        strong: false,
        retry: false
    }, function (err, key) {
        if(key){
            const newM = new Mailvf({
                uid:userData.uid,
                vt:key
            })
            newM.save().then(r=>{
                sendMail.send_mail({
                    email:userData.email,
                    sub:"Activation link",
                    body:"<p>Click here to activate <a href='http://localhost:3000/user/verifymail?id="+userData.uid+"&token="+key+"'>link</a></p>"
                },(er,resul)=>{
                    if(resul)
                        callback(null, 'success');
                    else
                        callback(er, null);  
                })
            })
            .catch(e=>{
                callback(er, null);
            })
        }
        else{
            callback(er, null);
        }
    });
    
}