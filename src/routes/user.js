import express from "express";
import userController from "../controllers/userController.js";
import { adminMiddleware, userMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", adminMiddleware, userController.delete);
router.get("/refresh-token", userController.refreshToken);
router.get("/:id", userMiddleware, userController.getUserById);
router.get("/", adminMiddleware, userController.getUsers);

export default router;
