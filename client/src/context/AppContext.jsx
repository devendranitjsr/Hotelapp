
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// Axios base URL set from .env
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();
  const { user } = useUser();           // Clerk user
  const { getToken } = useAuth();       // Clerk token function

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () =>{
    try{
      const { data }  = await axios.get('/api/rooms')
      if(data.success){
        setRooms(data.rooms)
      }else{
        toast.error(data.message)
      }
    } catch(error){
      toast.error(error.message)

    }
  }

  // Create user in MongoDB after Clerk login
  const createUserInDB = async () => {
    if (!user) return;

    try {
      const token = await getToken();

      await axios.post("/api/user/create", {
        _id: user.id,
        username: user.username || user.firstName || "User",
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(" User created or already exists in DB");
    } catch (err) {
      console.error(" Failed to create user in DB:", err);
    }
  };

  //  Fetch user data from backend
  const fetchUser = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities);
      } else {
        console.warn("User fetch failed: response.success false", data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user");
      console.error("Fetch user error:", error);
    }
  };

  //  Run both on user login
  useEffect(() => {
    if (user) {
      createUserInDB();
      fetchUser();
    }
  }, [user]);

  useEffect(()=>{
    fetchRooms();
  },[])

  //  Context values
  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,setRooms
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
