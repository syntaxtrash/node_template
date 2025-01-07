import DatabaseModel from "./database.model.js";

class ProductModel extends DatabaseModel{
    fetchAllProducts = async () => {
        const response_data = { status: false, result: {}, error: null };
        
        try{
            response_data.result.products = await this.executeQuery("SELECT * FROM products");
            response_data.status = true;
        }
        catch(error){
            console.log(error);
        }

        return response_data;
    }
}

export default ProductModel;