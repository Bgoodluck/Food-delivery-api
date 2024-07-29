import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import profileAuth from '../middleware/profileAuth.js'; 

const profileRouter = express.Router();

profileRouter.get("/profile", profileAuth, getProfile);
profileRouter.post("/profile/update", profileAuth, updateProfile); 
export default profileRouter;
