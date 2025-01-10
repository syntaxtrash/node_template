import { format } from "mysql2";
import DatabaseModel from "./database.model.js";

class ProductModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchProductRecord = async (fields_to_select = "*", where_clause = "", where_values = []) => {
        return await this.executeQuery(format(
            `SELECT ${fields_to_select} FROM products
            ${where_clause ? `WHERE ${where_clause}` : ""}
            `, where_values
        ));
    } 

    insertUserCartProductsData = async (products_data) => {
        return await this.executeQuery(format("INSERT INTO user_cart_products SET ?", [products_data]));
    }
}

export default ProductModel;