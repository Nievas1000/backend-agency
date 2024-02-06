const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "lautynievas09@gmail.com",
    pass: process.env.PASSWORD,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/getQuote", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const services = req.body.services.join(", ");
  const mail = {
    from: name,
    to: "lautynievas09@gmail.com",
    subject: "Get quote needed",
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Services: ${services}</p>
             <p>Message: ${message}</p>
             `,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

app.listen(port, () => console.log("Server Running on port", port));
