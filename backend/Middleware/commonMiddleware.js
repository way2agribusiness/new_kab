import jwt from "jsonwebtoken";
import User from "../Models/User/userModels.js";
import Seller from "../Models/FPO/sellerModels.js";
import dotenv from "dotenv";

dotenv.config();

// Middleware to protect routes
export const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user || req.user.token !== token) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const authFPO = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.seller = await Seller.findById(decoded.id);

    if (!req.seller || req.seller.token !== token) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

