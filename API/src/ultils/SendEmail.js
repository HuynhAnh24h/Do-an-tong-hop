const nodemailer = require("nodemailer") 

const sendMail = async ({email,html}) => {
        try{
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.GOOGLE_KEY_SECRET,
                },
            })
            let info = await transporter.sendMail({
                from: '" Tình Cute 👻" <no-relply@gmail.com>', 
                to: email, 
                subject: "Forgot Password", 
                html: html, 
            })
            return info

        }catch(err){
            return console.log(err)
        }
    }
module.exports = {
    sendMail
}