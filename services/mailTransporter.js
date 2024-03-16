const nodemailer = require("nodemailer")

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "sunidhigo@gmail.com",
    pass: "ywuq gizk ffno tcgh",
  },
})

module.exports = mailTransporter