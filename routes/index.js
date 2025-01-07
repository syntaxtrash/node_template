/* Vendors */
import { Router } from "express";

/* Controllers */
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.index);

export default router;