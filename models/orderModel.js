import mongoose from 'mongoose'


const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
  }, { _id: false });
  

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phone: {type: String},

    items: {
        type: Array,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    address: {
        type: addressSchema,
        required: function() { return !this.useRegisteredAddress; }
    },
    
  useRegisteredAddress: {
    type: Boolean,
    default: true
  },

    status: {
        type: String,
        default: "Food Processing"
    },

    date: {
        type: Date,
        default: Date.now()
    },

    payment: {type: Boolean,
        default: false
    }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;