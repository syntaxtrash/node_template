import ProductModel from "../models/product.model.js";
import UserCartProductModel from "../models/user_cart_product.model.js";

class ProductController {
    index = async (req, res) => {
        let products = [];

        try{
            products = await new ProductModel().fetchProductRecord();    
        }
        catch(error){
            console.log(error);
        }

        res.render("index", { user: req.session.user, products });
    }
    
    addProductToCart = async (req, res) => {
        const response_data = { status: false, message: "" }

        try{
            const { product_id, quantity = 1 } = req.body;
            const [ product_details ] = await new ProductModel().fetchProductRecord("id, name", "id = ?", [product_id]);;

            if(product_details.id){
                const userCartProductModel = new UserCartProductModel();
                /* Check if the product to be added is already in the cart. */
                const [ cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                    "*",
                    "user_id = ? AND product_id = ?",
                    [req.session.user.id, product_id]
                );

                /* If the product already exist on user's cart, increase the quantity. */
                if(cart_product?.id){
                    const { affectedRows } = await userCartProductModel.updateUserCartProductsData(cart_product.id, { quantity: cart_product.quantity + parseInt(quantity) });

                    response_data.status = !!affectedRows;
                }
                /* If the product is not yet on the user's cart, create new cart product record. */
                else{
                    const { insertId } = await userCartProductModel.insertUserCartProductsData({ product_id, quantity, user_id: req.session.user.id });

                    response_data.status = !!insertId;
                }

                response_data.message = response_data.status ? `${quantity} ${product_details.name}(s) added to cart.` : "Failed to add product to cart."
            }
            else{
                response_data.message = "Product does not exist.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }
}

export default new ProductController;