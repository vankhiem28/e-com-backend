import express from "express";
import productController from "../controllers/productController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", adminMiddleware, productController.create);
router.put("/update/:id", adminMiddleware, productController.update);
router.delete("/delete/:id", adminMiddleware, productController.delete);
router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

export default router;
