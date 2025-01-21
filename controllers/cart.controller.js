import UserCartProductModel from "../models/user_cart_product.model.js";

class ProductController {
    index = async (req, res) => {
        let products_on_cart = [];

        try{
            products_on_cart = await new UserCartProductModel().fetchProductsOnCart(req.session.user.id);    
        }
        catch(error){
            console.log(error);
        }

        res.render("cart", { user: req.session.user, products_on_cart });
    }

    updateCartData = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const { product_id, quantity = 1 } = req.body;
            const userCartProductModel = new UserCartProductModel();
    
            const [ cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                "id",
                "user_id = ? AND product_id = ?",
                [req.session.user.id, product_id]
            );

            if(cart_product?.id){
                const { affectedRows } = await userCartProductModel.updateUserCartProductsData(cart_product.id, { quantity });
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Product not found in the cart.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }

    removeProductToCart = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const { product_id } = req.body;
            const userCartProductModel = new UserCartProductModel();

            const [ cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                "id",
                "user_id = ? AND product_id = ?",
                [req.session.user.id, product_id]
            );

            if(cart_product?.id){
                const { affectedRows } = await userCartProductModel.deleteUserCartProductsData(cart_product.id);
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Product not found in the cart.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }

    checkout = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const userCartProductModel = new UserCartProductModel();
            const { affectedRows } = await userCartProductModel.clearUserCartProducts(req.session.user.id);
            
            if(affectedRows){
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Failed to checkout products on cart.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }
}

export default new ProductController;