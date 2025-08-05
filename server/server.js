// import express from "express"
// import "dotenv/config";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import { clerkMiddleware } from '@clerk/express'
// import clerkWebhooks from "./controllers/clerkWebhooks.js";
// import userRouter from "./routes/userRouter.js";
// import hotelRouter from "./routes/hotelRoutes.js";
// import connectCloudinary from "./configs/cloudinary.js";
// import roomRouter from "./routes/roomRoutes.js";
// import bookingRouter from "./routes/bookingRouter.js";


// connectDB()
// connectCloudinary();
// // dotenv.config();
// console.log("🌐 ENV CHECK:", {
//   CLOUDINARY_CLOUD_NAME: process.env.dun1dh1os,
//   CLOUDINARY_API_KEY: 954475221913558,
//   CLOUDINARY_API_SECRET: process.env.HxdSSBVW6KbDqJ8Kr0Bc7kE4Jls
// });

// const app = express()
// app.use(cors()) //Enable crosss-origin resource sharing

// // Middleware
// app.use(express.json())
// app.use(clerkMiddleware())

// // Api to listen to Clerk Webhooks
// app.use("/api/clerk",clerkWebhooks)

// app.get('/',(req,res) => res.send("API IS WORKING FINE"))
// app.use('/api/user',userRouter)
// app.use('/api/hotels',hotelRouter)
// app.use('/api/rooms',roomRouter)
// app.use('/api/booking',bookingRouter)


// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// server.js

import express from "express";
import "dotenv/config"; // ensure envs load before anything
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRouter.js";

// Connect DB and Cloudinary
connectDB();
connectCloudinary(); // now uses correct env vars

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Clerk Webhook route
app.use("/api/clerk", clerkWebhooks);

// Routes
app.get('/', (req, res) => res.send("API IS WORKING FINE"));
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/booking', bookingRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
