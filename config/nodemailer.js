import nodemailer from 'nodemailer'




<<<<<<< HEAD

=======
// you have to create this transporter object using SMTP transport, i guess its what the email format uses
>>>>>>> 284ce2920a46db92fee7621b766dbc5adec9f2b2
const transporter = nodemailer.createTransport({
    service: 'outlook', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});




export default transporter;