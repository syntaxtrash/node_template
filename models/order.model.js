import { format } from "mysql2";
import DatabaseModel from "./database.model.js";

class OrderModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchOrderHistory = async (user_id) => {
        const fetch_order_history_query = format(`
            SELECT
                orders.id, orders.created_at AS ordered_at,
                JSON_ARRAYAGG(JSON_OBJECT(
                    "quantity", quantity,
                    "price", ordered_products.price,
                    "id", products.id,
                    "description", products.description,
                    "image_path", products.image_path,
                    "name", products.name
                )) AS products
            FROM orders
            INNER JOIN ordered_products
                ON ordered_products.order_id = orders.id
            INNER JOIN products
                ON ordered_products.product_id = products.id
            WHERE orders.user_id = ?
            GROUP BY orders.id
            ORDER BY orders.id DESC
        `, [user_id]);
        
        return await this.executeQuery(fetch_order_history_query);
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