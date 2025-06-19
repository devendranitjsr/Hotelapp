import {v2 as cloudinary } from "cloudinary"

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.dun1dh1os,
        api_key: 954475221913558,
        api_secret: process.env.HxdSSBVW6KbDqJ8Kr0Bc7kE4Jls,
    })
}

export default connectCloudinary;