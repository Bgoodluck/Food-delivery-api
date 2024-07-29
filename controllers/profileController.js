import profileModel from "../models/profileModel.js";
import userModel from "../models/userModel.js";

const getProfile = async (req, res) => {
    try {
        const user = req.user;                                        // to get the user from the request
        const userDetails = await userModel.findById(user._id);
        let profile = await profileModel.findOne({ userId: user._id });
        
        if (!profile) {
            
            profile = new profileModel({                   //this logic is for If no profile exists,then it should create one idea from  gbemi
                userId: user._id,
                firstName: userDetails.name,
                email: userDetails.email,
                address: userDetails.address
            });
            await profile.save();
        }
        console.log("Sending profile:", profile); 
        res.json({ success: true, profile, userDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const updateProfile = async (req, res) => {
    try {
        const user = req.user; 
        const { firstName, lastName, phone, address } = req.body;

        let profile = await profileModel.findOne({ userId: user._id });

        if (profile) {
            profile.firstName = firstName || profile.firstName;
            profile.lastName = lastName || profile.lastName;
            profile.phone = phone || profile.phone;
            profile.address = address || profile.address;
            await profile.save();
        } else {
            profile = new profileModel({
                userId: user._id,
                firstName,
                lastName,
                phone,
                address
            });
            await profile.save();
        }

        res.json({ success: true, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { getProfile, updateProfile };
