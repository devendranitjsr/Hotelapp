import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


const checkAvailability = async({checkInDate,checkOutDate, room}) => {
    try{
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;
    }
    catch(error){
        console.log(error.message);
        
    }
}

// APi to check avaliability of room
// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req,res) => {
    try{
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate,room});
        res.json({ success:true, isAvailable})
    } catch(error)
    {
        res.json({ success: false, message: error.message })
    }
}

// API TO CREEATE A NEW BOOKING
// POST /API/BOOKING/BOOK
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Before booking check availability
        const isAvailable = await checkAvailability({
            checkInDate, checkOutDate, room
        });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" });
        }

        // GET TOTALPRICE FROM ROOM
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // Calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= nights;

        // Create booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        // Send mail (optional - failure won't affect booking)
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your booking! Here are your details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
                </ul>  
                <p>We look forward to welcoming you!</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `
        };

        try {
            await transporter.sendMail(mailOption);
        } catch (mailError) {
            console.error("Email sending failed:", mailError.message);
            // Email failure won't affect booking
        }

        res.json({ success: true, message: "Booking created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to create booking" });
    }
};


// API TO GET ALL BOOKING FOR A USER 
// GET /api/bookings/user

export const getUserBookings = async(req,res) =>{
    try{
        const user = req.user._id;
        const bookings =  await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success: true, bookings})
    }
    catch(error) {
        res.json({success:false, message: "Failed to fetch boooking"});
    }
} 



export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id }); // ✅ req.auth.userId → req.user._id
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0); // ✅ Fixed acc

    res.json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};
