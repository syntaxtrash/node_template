export default (req, res, next) => {
    if(req.session.user){
        if(req.path === "/login"){
            return res.redirect("/");
        }
        
        return next();
    }
    else{
        if(req.path === "/login"){
            return next();
        }

        req.flash("error", "You must be logged in to view this page.");
        return res.redirect("/login");
    }

}