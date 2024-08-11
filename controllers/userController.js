// import userModel from "../models/userModel.js";
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
// import validator from 'validator'


// const loginUser = async (req, res)=>{
//     const {email, password} = req.body;
//     try {
//         const user = await userModel.findOne({email});

//         if (!user) {
//             res.json({success: false, message: "User does not exist"})
//         }

//         const isMatch = await bcrypt.compare(password,user.password);

//         if (!isMatch) {
//             return res.json({success: false, message: "Invalid Credentials"})
//         }

//         const token = createToken(user._id)
//         res.json({success: true, token})

//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }

// const createToken = (id)=>{
//     return jwt.sign({id},process.env.JWT_SECRET)
// }


// const registerUser = async (req, res)=>{

//     const {name,password,street,city, state, country,email} = req.body

//     const address = {street,city, state, country};

//     try {
        
//         const exists = await userModel.findOne({email});
//         if (exists) {
//             return res.json({success: false, message: "user already exists"})
//         }
        
//         if (!validator.isEmail(email)) {
//             return res.json({success: false, message: "Please enter a valid email"})
//         }

//         if (password.length<8) {
//             return res.json({success: false, message: "Please enter a strong password"})
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password,salt);

//         const newUser = new userModel({
//             name: name,
//             email: email,
//             address: address,
//             password: hashedPassword
//         })

//        const user = await newUser.save()
//         const token = createToken(user._id)
//         res.json({success: true, token})

//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: "Error"})
//     }
// }
//     // allowing users to either use their registered address or a new one when proceeding to payment for delvery

//  const getUserAddress = async (req, res) => {
//         try {
//           const userId = req.body.userId;                   //i used req.body.userId as per the middleware
//           const user = await userModel.findById(userId);
      
//           if (!user) {
//             return res.json({ success: false, message: 'User not found' });
//           }
      
//           const { firstName, lastName, email, phone, address } = user;
      
//           res.json({
//             success: true,
//             address: {
//               firstName,
//               lastName,
//               email,
//               phone,
//               street: address.street,
//               city: address.city,
//               state: address.state,
//               country: address.country,
//             },
//           });
//         } catch (error) {
//           res.json({ success: false, message: 'Server error' });
//         }
//       };


// export {loginUser, registerUser, getUserAddress}



import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import transporter from '../config/nodemailer.js';
import { v4 as uuidv4 } from 'uuid'; 


const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            res.json({success: false, message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const token = createToken(user._id)
        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    const { name, password, street, city, state, country, email } = req.body;

    const address = { street, city, state, country };

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = uuidv4();

        const newUser = new userModel({
            name,
            email,
            address,
            password: hashedPassword,
            verificationToken, 
            isVerified: false
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        
        const verificationUrl = `${process.env.FRONTEND_URL}/api/email/verify/${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the link: ${verificationUrl}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};
    // allowing users to either use their registered address or a new one when proceeding to payment for delvery

 const getUserAddress = async (req, res) => {
        try {
          const userId = req.body.userId;                   //i used req.body.userId as per the middleware
          const user = await userModel.findById(userId);
      
          if (!user) {
            return res.json({ success: false, message: 'User not found' });
          }
      
          const { firstName, lastName, email, phone, address } = user;
      
          res.json({
            success: true,
            address: {
              firstName,
              lastName,
              email,
              phone,
              street: address.street,
              city: address.city,
              state: address.state,
              country: address.country,
            },
          });
        } catch (error) {
          res.json({ success: false, message: 'Server error' });
        }
      };


export {loginUser, registerUser, getUserAddress}