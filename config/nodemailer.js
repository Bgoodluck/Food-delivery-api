import nodemailer from 'nodemailer'




// you have to create this transporter object using SMTP transport, i guess its what the email format uses
const transporter = nodemailer.createTransport({
    service: 'outlook', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});




export default transporter;