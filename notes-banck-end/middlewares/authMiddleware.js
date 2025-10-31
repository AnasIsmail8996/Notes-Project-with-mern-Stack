import jwt from "jsonwebtoken";
import UserModel from "../models/user-schema.js";

const checkAuth = async (request, response, next) => {
  try {
    const token = request.header("Authorization")?.replace("Bearer ", "");
    if (!token) return response.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    const user = await UserModel.findById(decoded._id).select("-password");
    if (!user) return response.status(404).json({ message: "User not found" });

    request.user = user; 
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    response.status(401).json({ message: "Unauthorized" });
  }
};

export { checkAuth };


