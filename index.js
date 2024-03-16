const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const contactEmail = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secure: true,
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: "lautaro.nievas@nevvedesign.com",
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
    from: "lautaro.nievas@nevvedesign.com",
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

const confirmationEmail = (email, linkedin, aditional) => {
  const mail = {
    from: "lautaro.nievas@nevvedesign.com",
    to: "lautynievas09@gmail.com",
    subject: "New Email From Nevve Funnel",
    text: `New customer to our email list: ${email}
          Linkedin account: ${linkedin}
          Additional Information: ${aditional}
    `,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Email Saved" });
    }
  });
};

router.post("/salesFunnel", (req, res) => {
  const { name, email, linkedin, aditional } = req.body;

  const mailClient = {
    from: "lautaro.nievas@nevvedesign.com",
    to: email,
    subject: "Free Website From Nevve",
    text: `
      Hello ${name}!

      Thank you for your interest in our free Website service. We're thrilled to have you on board and want to assure you that your request is being processed diligently.

      Please stay tuned as within the next 48 hours, you will receive the URL for your website. This valuable resource will be instrumental in propelling your business to new heights!
      
      If you have any immediate questions or need further assistance, feel free to reach out to us. We're here to support you every step of the way.
      
      Thank you once again for choosing us, and we look forward to assisting you in achieving your business goals.
      
      Best regards,
      Lautaro Nievas
      Nevve
    `,
  };
  confirmationEmail(email, linkedin, aditional);
  contactEmail.sendMail(mailClient, (error) => {
    if (error) {
      res.send({ error });
    } else {
      res.send({ code: 200, status: "Message Sent" });
    }
  });
});

app.listen(port, () => console.log("Server Running on port", port));
