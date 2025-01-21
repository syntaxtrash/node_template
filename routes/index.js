/* Vendors */
import { Router } from "express";

/* Controllers */
import productController from "../controllers/product.controller.js";
import userController from "../controllers/user.controller.js";
import cartController from "../controllers/cart.controller.js";
import orderController from "../controllers/order.controller.js";

const router = Router();

/* Users */
router.get("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/login", userController.processLogin);

/* Products */
router.get("/", productController.index);
router.post("/products/add-to-cart", productController.addProductToCart);

/* Carts */
router.get("/carts", cartController.index);
router.post("/carts/update", cartController.updateCartData);
router.post("/carts/remove-product", cartController.removeProductToCart);
router.post("/carts/checkout", cartController.checkout);

/* Orders */
router.get("/orders", orderController.index);

export default router;