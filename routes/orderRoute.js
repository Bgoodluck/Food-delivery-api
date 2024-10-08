import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { placeOrder, createPaymentLink, verifyPayment, userOrders, listOrders, updateStatus, deleteOrder } from '../controllers/orderController.js';



const orderRouter = express.Router();

orderRouter.post("/placeorder", authMiddleware, placeOrder);
orderRouter.post('/verify', verifyPayment);
orderRouter.post('/user-orders', authMiddleware, userOrders);   // tried post
orderRouter.get('/list', listOrders )
orderRouter.post('/status', updateStatus)
orderRouter.delete('/delete/:id', deleteOrder)
orderRouter.post('/payment', createPaymentLink)

export default orderRouter;