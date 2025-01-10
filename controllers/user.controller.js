import UserModel from "../models/user.model.js";

class UserController {
    login = async (req, res) => {

        res.render("login", { error: req.flash("error") });
    }

    processLogin = async (req, res) => {
        let redirect_url = "/login";

        try{
            const { username, password } = req.body;
            const userModel = new UserModel();
            const [user_data] = await userModel.fetchUserByUsername(username);

            if(user_data?.password === password){
                req.session.user = {
                    id: user_data.id,
                    username: user_data.username
                };

                redirect_url = "/";
            }    
            else{
                req.flash("error", "Incorrect username or password.");
            }
        }
        catch(error){
            console.log(error);
            req.flash("error", "Something went wrong.");
        }

        res.redirect(redirect_url);
    }

    logout = async (req, res) => {
        req.session.destroy();
        res.redirect("/login");
    }
}

export default new UserController;