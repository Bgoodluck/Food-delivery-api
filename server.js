import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import { placeOrder, createPaymentLink } from './controllers/orderController.js'; 
import 'dotenv/config';
import dotenv from 'dotenv';
import adminRouter from './routes/adminRoute.js';
import restaurantRouter from './routes/restaurantRoute.js';
import profileRouter from './routes/profileRoute.js';

dotenv.config();


const app = express();
const port = 4000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://food-delivery-lovat-sigma.vercel.app", "http://localhost:5174"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    credentials: true
}));


connectDB();

app.use('/uploads', express.static('uploads'));


app.use("/api/food", foodRouter);
app.use("/api/restaurant", restaurantRouter); 
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);                    // Admin panel to get orders and user order
app.use('/api', profileRouter);


app.use('/api/admin', adminRouter);

// New routes for my placeOrder and createPaymentLink
app.post('/api/place-order', placeOrder);
app.post('/api/create-payment-link', createPaymentLink);

// for logging middleware
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});


app.get("/", (req, res)=> {
    res.send("API Working");
});


app.use((req, res, next) => {
    res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
