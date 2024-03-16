//userCreateRoutes.js
const express = require("express")
const bcrypt = require("bcrypt")
const userCreateRoutes = express.Router()
const UserSchema = require("../model/UserSchema")
const { createUserToken } = require("../auth/auth")
// userCreateRoutes.get("/", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Max-Age", "1800");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
//    });

const { getOTP, verifyOTP } = require("../auth/auth")

// SEND-FORGOT-PASSWORD-OTP
userCreateRoutes.post("/send-otp", (req, res) => {
  const { email } = req.body    
  getOTP(email)
  res.json({ message: "Success" })
  
})

userCreateRoutes.get("/", (req, res) => {
  UserSchema.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

//SIGNUP


userCreateRoutes.post("/signup", (req, res) => {
  const { name, email, password, otp } = req.body
  const match= verifyOTP(email,otp)
  if(match){
  UserSchema.create(
    {
      name: name,
      email: email,
      password: password,
    })
    .then(data=>{
      const accessToken = createUserToken({ email: email })
        res.cookie("user", accessToken, {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 1000,
        })
        res.json({ message: "Success" })
    })
    .catch(err=>{
      res.json({ error: err, status: 500 })
    })
  }
    
});

//LOGIN
userCreateRoutes.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserSchema.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.json({ error: "User does not exist", status: 500 });
      } else {
        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword)
          .then((match) => {
            if (match) {
              const accessToken = createUserToken({ email: email });
              res.cookie("user", accessToken, {
                sameSite: "none",
                secure: true,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 1000,
              });
              res.json({ message: "Success" });
            } else {
              res.json({ error: "Invalid credentials", status: 500 });
            }
          })
          .catch((err) => {
            console.log(err);
            res.json({ error: "Failed", status: 500 });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({ error: "Unable to fetch user", status: 500 });
    });
});


//LOGOUT
userCreateRoutes.get("/logout", (req, res) => {
  res.cookie(
    "user",
    {},
    {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    }
  )
  res.json({ message: "Success" })
})

module.exports = userCreateRoutes