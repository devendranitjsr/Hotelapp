import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRouter.js";


connectDB()
connectCloudinary();

const app = express()
app.use(cors()) //Enable crosss-origin resource sharing

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

// Api to listen to Clerk Webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res) => res.send("API IS WORKING FINE"))
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/booking',bookingRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
