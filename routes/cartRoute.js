import express from 'express'
import { addToCart, removeFromCart, deleteFromCart, getCart, syncCartItems } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart)
cartRouter.post("/sync", authMiddleware, syncCartItems)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.post("/delete", authMiddleware, deleteFromCart)
cartRouter.post("/get", authMiddleware, getCart)


export default cartRouter;