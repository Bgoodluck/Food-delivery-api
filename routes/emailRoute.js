import express from 'express'
import { verifyEmail } from '../controllers/emailController.js'


const emailRouter = express.Router();



emailRouter.get('/verify/:token',verifyEmail);


export default emailRouter;