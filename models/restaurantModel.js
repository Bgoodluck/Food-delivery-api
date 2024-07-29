import mongoose from "mongoose";


// const addressSchema = new mongoose.Schema({
//     street: String,
//     city: String,
//     state: String,
// }, { _id: false });

// const operatingHoursSchema = {
//     open: {
//         type: String,
//         required: true
//     },
//     close: {
//         type: String,
//         required: true
//     }
// };

// const restaurantSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     menu: {
//         type: Array,
//         required: true
//     },
//     address: {
//         type: addressSchema,
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     operating_hours: {
//         monday_to_friday: operatingHoursSchema,
//         saturday_and_sunday: operatingHoursSchema
//     }
      
// })

const restaurantSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    menu: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    operating_hours: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    
    operating_days: {
        type: String,
        required: true
    }
})



const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema)

export default restaurantModel;