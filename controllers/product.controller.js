import ProductModel from "../models/product.model.js";

class ProductController {
    index = async (req, res) => {
        res.render("index", { products: [] });
    }
}

export default new ProductController;