import DatabaseModel from "./database.model.js";

class ProductModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchAllProducts = async () => {
        return await this.executeQuery("SELECT * FROM products");
    }
}

export default ProductModel;