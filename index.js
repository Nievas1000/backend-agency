const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require('fs');
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
      ciphers:'SSLv3'
  },
  requireTLS:true,
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
    from: 'lautaro.nievas@nevvedesign.com',
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


const confirmationEmail = (email) =>{
  const mail = {
    from: 'lautaro.nievas@nevvedesign.com',
    to: 'lautynievas09@gmail.com',
    subject: "New Email From Nevve Funnel",
    text: `New customer to our email list: ${email}`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Email Saved" });
    }
  });
  
}

router.post("/salesFunnel", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const pdfAttachment = fs.readFileSync('./public/assets/Nevve.pdf', {encoding: 'utf8'});

  const mailClient = {
    from: 'lautaro.nievas@nevvedesign.com',
    to: email,
    subject: 'How To Attract And Retain Clients From Nevve',
    text: `
      Hello ${name}!

      Thank you for requesting our free guide on how to convert prospects into customers. We are excited to share with you this valuable resource that will help you take your business to the next level!
    
      To download your guide, simply click on the document attached to the email.
    
      We hope you find the information useful and that it helps you achieve your business goals. If you have any questions or need additional help, please do not hesitate to contact us.
    
      Thanks again and have a fantastic day!
    
      Best Regards,
      Lautaro Nievas
      Nevve
    `,
    attachments: [
        {
            filename: 'nevveGuide.pdf',
            content: pdfAttachment
        }
    ]
  }
  contactEmail.sendMail(mailClient, (error) => {
    if (error) {
      res.send({error});
      confirmationEmail(email)
    } else {
      confirmationEmail(email)
      res.send({ code: 200, status: "Message Sent" });
    }
  });
});

app.listen(port, () => console.log("Server Running on port", port));
