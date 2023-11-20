import express from "express";
const router =express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

// Route Level Middleware
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)


//Public Routes
router.post("/register",UserController.userRegistration)
router.post("/login",UserController.userLogin)
router.post("/reset",UserController.sendUserPasswordResetEmail)
router.post("/passwordreset/:id/:token",UserController.userPasswordReset)


//Protected Routes
router.post("/changepassword",UserController.changeUserPassword)
router.get("/loggeduser",UserController.loggedUser)


export default router;