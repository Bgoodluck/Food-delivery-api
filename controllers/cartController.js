import userModel from "../models/userModel.js";


const addToCart = async(req, res) =>{
    try {
                                                     //i can also use findbyid(req.body.userId)
        let userData = await userModel.findOne({_id: req.body.userId});
        let cartData = await userData.cartData;
        if (!cartData [req.body.itemId]) {

            cartData[req.body.itemId] = 1;
        }
        else{
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Added To Cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}


const removeFromCart = async (req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        if (cartData [req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
    }

}


const deleteFromCart = async (req, res) => {
    try {
<<<<<<< HEAD
        
=======
        // Find the user by ID
>>>>>>> 284ce2920a46db92fee7621b766dbc5adec9f2b2
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

<<<<<<< HEAD
        
        let cartData = userData.cartData;

        
        if (cartData[req.body.itemId] > 0) {
            
            delete cartData[req.body.itemId];
            
            
=======
        // Extract the cart data
        let cartData = userData.cartData;

        // Check if the item exists in the cart
        if (cartData[req.body.itemId] > 0) {
            // Remove the item from the cart
            delete cartData[req.body.itemId];
            
            // Update the user's cart in the database
>>>>>>> 284ce2920a46db92fee7621b766dbc5adec9f2b2
            await userModel.findByIdAndUpdate(req.body.userId, { cartData });
            res.json({ success: true, message: "Removed from cart" });
        } else {
            res.json({ success: false, message: "Item not found in cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
}



const getCart = async (req, res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success: true, cartData})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

export {addToCart, removeFromCart, deleteFromCart, getCart}