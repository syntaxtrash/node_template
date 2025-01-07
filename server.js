import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import session from 'express-session';
import routes from "./routes/index.js";

dotenv.config();

const app = express();

/* Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve("public")));
app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,  
        resave: false,
    })
);

/* View Engine */
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

/* Routes */
app.use("/", routes);

/* Server */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
