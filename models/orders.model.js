import { format } from "mysql2";
import DatabaseModel from "./database.model.js";

class OrderModel extends DatabaseModel{
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

    insertOrderData = async (products_data) => {
        return await this.executeQuery(format("INSERT INTO orders SET ?", [products_data]));
    }

    insertOrderedProductsData = async (ordered_products) => {
        const insert_ordered_products_query = format(`
            INSERT INTO ordered_products(user_id, order_id, product_id, quantity, price) 
            VALUES ?
        `, [ordered_products]);
        
        return await this.executeQuery(insert_ordered_products_query);
    }
}

export default OrderModel;