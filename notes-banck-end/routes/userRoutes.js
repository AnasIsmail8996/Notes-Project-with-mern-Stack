import express from "express";
const router= express.Router();
import { registerUser, loginUser, createNotes, getMyNotes } from "../controllers/userController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";



router.post("/register", registerUser);
router.post("/login",  loginUser);
router.post("/createPost", checkAuth, createNotes);
router.get("/myNotes", checkAuth, getMyNotes);

export default router;
