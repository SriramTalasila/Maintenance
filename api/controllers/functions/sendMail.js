var nodemailer = require('nodemailer');
const config = require('../../../config');

exports.send_mail = (mailData,callback)=>{
  console.log(mailData);
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:587,
        auth: {
          user: config.dev.smtp.email,
          pass: config.dev.smtp.password
        }
      });
      
      var mailOptions = {
        from: "ram98.sri98@gmail.com",
        to: mailData.email,
        subject: mailData.sub,
        html: mailData.body
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(null,"sd");
        } else {
          console.log('Email sent: ' + info.response);
          callback(null,'success');
        }
      });
    
}