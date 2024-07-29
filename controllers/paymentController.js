// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Flutterwave from "flutterwave-node-v3";
// import { v4 as uuidv4 } from "uuid";
// import fetch from "node-fetch";
// import { getCart } from "./cartController.js";

// const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
// const frontend_url = "http://localhost:5173";

// // const flw = new Flutterwave(FLW_SECRET_KEY);

// if (!FLW_SECRET_KEY) {
//     console.error("Flutterwave Secret Key is not set. Please set FLW_SECRET_KEY in your environment variables.");
//     process.exit(1);
//   }
// // Placing user order from frontend
// const placeOrder = async (req, res) => {
//   const { user } = req;
//   const { userId, items, amount, address, email, phone, name } = req.body;
//   const currency = "NGN"; // Assuming NGN as the currency

//   try {
//     // Create a new order
//     const newOrder = new orderModel({
//       userId,
//       items,
//       amount,
//       address,
//     });
//     await newOrder.save();

//     const orderId = uuidv4();

//     // Clear the user's cart
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     // Create line items for the payment link
//     const lineItems = items.map((item) => ({
//       name: item.name,
//       amount: item.price,
//       quantity: item.quantity,
//     }));

//     lineItems.push({
//       name: "Delivery Charges",
//       amount: 2,
//       quantity: 1,
//     });

//     // Create payment link payload
//     const payload = {
//       tx_ref: `order-${orderId}`,
//       amount,
//       currency,
//       payment_options: "card",
//       redirect_url: `${frontend_url}/verify`,
//       customer: {
//         email: user.email,
//         name: `${user.firstName} ${user.lastName}`,
//       },
//       customizations: {
//         title: "Food Delivery Order Payment",
//         description: "Payment for items in cart",
//       },
//     };

//     // Create payment link with Flutterwave
//     const response = await flw.PaymentLink.create(payload);

//     // Fallback to direct API call if necessary
//     if (response.status !== "success") {
//       const directResponse = await fetch("https://api.flutterwave.com/v3/payments", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${FLW_SECRET_KEY}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await directResponse.json();

//       if (data.status === "success") {
//         res.json({ success: true, session_url: data.data.link });
//       } else {
//         throw new Error("Failed to create payment link through direct API call");
//       }
//     } else {
//       res.json({ success: true, session_url: response.data.link });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

// // Verify the payment after redirection from the payment gateway
// const verifyPayment = async (req, res) => {
//   try {
//     const { transaction_id, orderId } = req.body;
//     const user = req.user.id;

//     const response = await fetch(
//       `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${FLW_SECRET_KEY}`,
//         },
//       }
//     );

//     const data = await response.json();

//     if (data.status === "success") {
//       const cart = await getCart(user);

//       const order = new orderModel({
//         userId: user,
//         orderId,
//         firstName: data.data.meta.firstName,
//         lastName: data.data.meta.lastName,
//         phone: data.data.meta.phone,
//         address: data.data.meta.address,
//         items: cart.products,
//         amount: data.data.amount,
//         status: "completed",
//         transactionId: transaction_id,
//       });

//       await order.save();
//       await userModel.findByIdAndUpdate(user, { cartData: {} });

//       res.json({ msg: "Payment Successful", order });
//     } else {
//       res.json({ msg: "Payment verification failed" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.json({ msg: "Server error" });
//   }
// };

// export default { placeOrder, verifyPayment };
