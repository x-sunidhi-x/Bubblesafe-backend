const mongoose=require("mongoose");
const express=require("express");
const bodyparser=require("body-parser");
const cors = require("cors")
const cookieparser = require("cookie-parser")
const userCreateRoutes=require("./controller/userCreateRoutes")
const { validateUserToken } = require("./auth/auth")
mongoose.set("strictQuery", true)
mongoose.connect("mongodb+srv://sunidhigopalan2021:ihdinus%40124B@cluster0.ejm5lng.mongodb.net/BubbleSafe")
var db = mongoose.connection
db.on("open", () => {
  console.log("Connected to DB")
})
db.on("error", () => console.log("Not Connected to DB"))
const app=express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
const corsOptions ={
  origin:'https://bubble-safe-frontend-oms5byj64-x-sunidhi-xs-projects.vercel.app/', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
// app.use(cors({origin: true, credentials: true}));
// app.use(cors());
app.use(cookieparser());

app.use("/user-create", userCreateRoutes);
// Listening to a port number
app.listen(8000, () => console.log("Server started at 8000"))



