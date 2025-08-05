
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserData,
  storeRecentSearchedCities,
  createUser, //  import added
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities);
userRouter.post('/create', createUser); //  route added

export default userRouter;
