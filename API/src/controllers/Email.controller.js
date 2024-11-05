const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

module.exports = {
    sendMail: asyncHandler(async(data,req,res)=>{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: process.env.MAIL_ACCOUNT,
              pass: process.env.GOOGLE_KEY_EMAIL,
            },
          });
          
        let info = await transporter.sendMail({
          from: '"24hcoding" <24hcoding-car@gmail.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        });
        
        console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    })
}