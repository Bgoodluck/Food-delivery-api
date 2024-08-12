import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import profileAuth from '../middleware/profileAuth.js'; 
import multer from 'multer'

const profileRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage:storage})

profileRouter.get("/profile", profileAuth, getProfile);
profileRouter.post("/profile/update", profileAuth, upload.single("image"), updateProfile); 
export default profileRouter;
