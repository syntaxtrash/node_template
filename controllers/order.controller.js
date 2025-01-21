import OrderModel from "../models/order.model.js";

class OrderController {
    index = async (req, res) => {
        let orders = [];

        try{
            orders = await new OrderModel().fetchOrderHistory(req.session.user.id);    
        }
        catch(error){
            console.log(error);
        }

        res.render("order", { user: req.session.user, orders });
    }
}

export default new OrderController;