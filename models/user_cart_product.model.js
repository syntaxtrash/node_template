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

    insertUserCartProductsData = async (products_data) => {
        return await this.executeQuery(format("INSERT INTO user_cart_products SET ?", [products_data]));
    }
    
    updateUserCartProductsData = async (user_cart_id, products_data) => {
        return await this.executeQuery(format("UPDATE user_cart_products SET ? WHERE id = ?", [products_data, user_cart_id]));
    }
    
    deleteUserCartProductsData = async (user_cart_id) => {
        return await this.executeQuery(format("DELETE FROM user_cart_products WHERE id = ?", [user_cart_id]));
    }
}

export default UserCartProductModel;