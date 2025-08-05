import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    contact: {type: String, required: true},
    owner: {type: String, required: true, ref: "User"},
    city: {type: String, required: true},
    //  country: { type: String, required: true }, // ✅ add this
}, {timestamps: true});

// const Hotel = mongoose.model("Hotel", hotelSchema);
const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);


export default Hotel;