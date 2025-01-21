import OrderModel from "../models/orders.model.js";
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
        const orderModel = new OrderModel();
        const transaction_connection = await orderModel.startTransaction();

        try{
            const product_ids = JSON.parse(req.body.product_ids || "[]");
            
            if(product_ids.length){
                orderModel.setActiveTransaction(transaction_connection);

                const current_user_id = req.session.user.id;
                const userCartProductModel = new UserCartProductModel(transaction_connection);
                const [{ total_price, product_details }] = await userCartProductModel.fetchCartProductsDetails(current_user_id, product_ids);

                /* If the fetched product matches the number of product IDs provided in the request, proceed with creating the order. */
                if(product_details?.length === product_ids.length){
                    const { insertId } = await orderModel.insertOrderData({ user_id: current_user_id, total_price});

                    /* If order record has been created, proceed with inserting ordered products data. */
                    if(insertId){
                        const { affectedRows: ordered_products_count } = await orderModel.insertOrderedProductsData(product_details.map(product => [current_user_id, insertId, product.id, product.quantity, product.price]));
                        
                        /* If ordered products data has been created, proceed with clearing the cart items. */
                        if(ordered_products_count){
                            const { affectedRows } = await userCartProductModel.clearUserCartProducts(current_user_id);
                            
                            if(affectedRows){
                                await orderModel.commitTransaction(transaction_connection);
                                response_data.status = !!affectedRows;
                            }
                            else{
                                throw new Error("Failed to checkout products on cart.");
                            }
                        }
                        else{
                            throw new Error("Failed to create ordered products data.");
                        }
                    }
                    else{
                        throw new Error("Failed to checkout products on cart.");
                    }
                }
                else{
                    throw new Error("Some products are not found in the cart.");
                }
            }
            else{
                throw new Error("Your cart is empty.");
            }
        }
        catch(error){
            await orderModel.cancelTransaction(transaction_connection);
            console.log(error);
            response_data.message = error.message;
        }

        res.json(response_data);
    }
}

export default new ProductController;