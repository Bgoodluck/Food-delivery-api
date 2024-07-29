import restaurantModel from "../models/restaurantModel.js";
import fs from 'fs'


const addRestaurant = async (req, res) => {

    let image_filename = `${req.file.filename}`
     
    const restaurant = new restaurantModel({
     name: req.body.name,
     menu: req.body.menu,
     address:req.body.address,
     operating_hours: req.body.operating_hours,
     operating_days: req.body.operating_days,
     image: image_filename
    })
    try {
         await restaurant.save();
         res.json({success: true, message: "Restaurant Added"})
    } catch (error) {
         console.log(error);
         res.json({success: false, message: "Error"})
    }
 }


const listRestaurant = async (req, res)=> {
    try {
        const restaurants = await restaurantModel.find({});
        res.json({success: true, data:restaurants})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}


const removeRestaurant = async (req, res)=> {
        try {
            const restaurant = await restaurantModel.findById(req.body.id)
            fs.unlink(`uploads/${restaurant.image}`, ()=> {})

            await restaurantModel.findByIdAndDelete(req.body.id);
            res.json({success: true, message: "Restaurant Removed"})
        } catch (error) {
            console.log(error);
            res.json({success: false, message: "Error"})            
        }
}

export {addRestaurant, listRestaurant, removeRestaurant}