import express from 'express'
import { loginUser, registerUser, getUserAddress } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/address", getUserAddress);   //using the authmiddleware here to get users registered address


export default userRouter;