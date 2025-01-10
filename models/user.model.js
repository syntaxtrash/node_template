import { format } from "mysql2";
import DatabaseModel from "./database.model.js";

class UserModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchUserByUsername = async (username) => {
        const fetch_user_query = format("SELECT id, username, password FROM users WHERE username = ?", [username]);

        return await this.executeQuery(fetch_user_query);
    }
}

export default UserModel;