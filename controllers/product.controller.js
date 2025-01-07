import ProductModel from "../models/product.model.js";

class ProductController {
    index = async (req, res) => {
        const products = await new ProductModel().fetchAllProducts();

        res.render("index", { products });
    }
}

export default new ProductController;