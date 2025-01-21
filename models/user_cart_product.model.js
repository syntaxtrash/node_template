import { format } from "mysql2";
import DatabaseModel from "./database.model.js";

class UserCartProductModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchUserCartProductRecord = async (fields_to_select = "*", where_clause = "", where_values = []) => {
        return await this.executeQuery(format(
            `SELECT ${fields_to_select} FROM user_cart_products
            ${where_clause ? `WHERE ${where_clause}` : ""}
            `, where_values
        ));
    }

    fetchProductsOnCart = async (user_id) => {
        return await this.executeQuery(format(`
        SELECT
            user_cart_products.quantity,
            products.id, products.name, products.description, products.price
        FROM user_cart_products
        INNER JOIN products
            ON products.id = user_cart_products.product_id
        WHERE user_id = ?;`, 
        [user_id]
        ));
    }

    fetchCartProductsDetails = async (user_id, product_ids) => {
        const fetch_cart_products_details = format(`
             SELECT SUM(user_cart_products.quantity * products.price) AS total_price,
                JSON_ARRAYAGG(JSON_OBJECT(
                    "id", products.id,
                    "quantity", user_cart_products.quantity,
                    "name", products.name,
                    "price", products.price
                )) AS product_details
            FROM user_cart_products
            INNER JOIN products
                ON products.id = user_cart_products.product_id
            WHERE user_id = ?
            AND products.id IN (?);
        `, [user_id, product_ids]);

        return await this.executeQuery(fetch_cart_products_details);
    }

    insertUserCartProductsData = async (products_data) => {
        return await this.executeQuery(format("INSERT INTO user_cart_products SET ?", [products_data]));
    }
    
    updateUserCartProductsData = async (user_cart_id, products_data) => {
        return await this.executeQuery(format("UPDATE user_cart_products SET ? WHERE id = ?", [products_data, user_cart_id]));
    }
    
    deleteUserCartProductsData = async (user_cart_id) => {
        return await this.executeQuery(format("DELETE FROM user_cart_products WHERE id = ?", [user_cart_id]));
    }
    
    clearUserCartProducts = async (user_id) => {
        return await this.executeQuery(format("DELETE FROM user_cart_products WHERE user_id = ?", [user_id]));
    }
}

export default UserCartProductModel;