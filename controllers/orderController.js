import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

if (!FLW_SECRET_KEY) {
    throw new Error("FLW_SECRET_KEY is not defined");
}

const frontend_url = "http://localhost:5173";


const placeOrder = async (req, res) => {
    try {
        const { useRegisteredAddress, infoData, items, amount, address } = req.body;
        const token = req.headers.authorization.split(' ')[1];

         // Decode the JWT token to get the userId
         const decoded = jwt.verify(token, JWT_SECRET);
         const userId = decoded.id;

        let finalAddress = address;

        if (useRegisteredAddress) {
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            finalAddress = user.address;
            if (!finalAddress) {
                return res.status(400).json({ success: false, message: 'Registered address not found' });
            }
        }
        
        
        const newOrder = new orderModel({
            userId: userId,
            items,
            amount,
            firstName: infoData.firstName,
            lastName: infoData.lastName,
            email: infoData.email,
            phone: infoData.phone,
            address: finalAddress,
            useRegisteredAddress,
        });
        await newOrder.save();

        // to clear the user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const createPaymentLink = async (req, res) => {
    try {
        const { amount, email, phone, name, orderId } = req.body;

        const payload = {
            tx_ref: `order-${orderId}`,
            amount: amount,
            currency: "NGN",
            payment_options: "card,banktransfer",
            redirect_url: `${frontend_url}/thanks`, 
            meta: {
                order_id: orderId
            },
            customer: {
                email: email,
                phone_number: phone,
                name: name,
            },
            customizations: {
                title: "Food Delivery Order Payment",
                description: "Payment for items in cart",
            },
        };

        const response = await fetch("https://api.flutterwave.com/v3/payments", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.status === "success") {
            res.json({ success: true, link: data.data.link });
        } else {
            res.status(400).json({ success: false, message: "Payment Initiation Failed", error: data.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const verifyPayment = async (req, res) => {
    const { transaction_id , tx_ref } = req.query;
    try {
        console.log('Verifying transaction:', transaction_id, 'with tx_ref:', tx_ref);
        
        const response = await fetch(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${FLW_SECRET_KEY}`,
                },
            }
        );

        const data = await response.json();
        console.log('Flutterwave response:', data);

        if (data.status === "success" && data.data.status === "successful") {
            
        } else {
            console.log('Payment verification failed. Response:', data);
            if (data.data && data.data.meta && data.data.meta.order_id) {
                await orderModel.findByIdAndDelete(data.data.meta.order_id);
            }
            res.status(400).json({ success: false, message: "Payment verification failed", details: data });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId;  
        console.log('Fetching orders for user ID:', userId); // Debug log to identify my error with not getting userorder

        const orders = await orderModel.find({ userId})
        res.json({success: true, data: orders})
        
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.json({success: false, message: "Error"})
    }
}

// List Orders for my admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate('userId', 'firstName lastName email phone address')  // Populate user details if its a registered user
            .lean();  //i use this to convert the mongoose model to a plain JavaScript for easier manipulation 

        const ordersWithDetails = orders.map(order => ({
            ...order,
            name: getName(order),
            email: order.email || (order.userId && order.userId.email),
            phone: order.phone || (order.userId && order.userId.phone),
            address: getAddress(order),
            userType: order.userId ? 'Registered' : 'Guest',
        }));

        res.json({success: true, data: ordersWithDetails});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: "Error fetching orders"});
    }
};

function getName(order) {
    if (order.firstName && order.lastName) {
        return `${order.firstName} ${order.lastName}`;
    }
    if (order.userId && order.userId.firstName && order.userId.lastName) {
        return `${order.userId.firstName} ${order.userId.lastName}`;
    }
    return 'N/A';
}

function getAddress(order) {
    if (order.useRegisteredAddress && order.userId && order.userId.address) {
        return order.userId.address;
    }
    return order.address || {};
}

// so as to update my order status in admin panel
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
            res.json({success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// still for my admin panel
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;     //this is the id of order to be deleted
        await orderModel.findByIdAndDelete(orderId)
        res.json({success: true, message: "Order deleted successfully"});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: "Error deleting order"});
    }
}


export { placeOrder, createPaymentLink, verifyPayment, userOrders, listOrders, updateStatus, deleteOrder };
