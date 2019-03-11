var nodemailer = require('nodemailer');
const config = require('../../../config');

exports.send_mail = (mailData,callback)=>{
  console.log("Sending mail to "+mailData.email);
    var transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port:587,
        auth: {
          user: config.dev.smtp.user,
          pass: config.dev.smtp.password
        }
      });
      
      var mailOptions = {
        from: "<noreply@ram.com>",
        to: mailData.email,
        subject: mailData.sub,
        html: mailData.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback("null",null) ;
        } else {
          console.log('Email sent: ' + info.response);
          callback(null,'success');
        }
      });
    
}