var nodemailer = require('nodemailer');
const config = require('../../../config');

exports.send_mail = (mailData,callback)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.dev.smtp.email,
          pass: config.dev.smtp.password
        }
      });
      
      var mailOptions = {
        from: config.dev.smtp.email,
        to: mailData.email,
        subject: mailData.sub,
        html: mailData.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback('failed to send mail',null);
        } else {
          console.log('Email sent: ' + info.response);
          callback(null,'success');
        }
      });
    
}