import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  // let transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const emailOptions = {
    from: "POS Dissh support<support@dissh.com>",
    to: option.email,
    subject: option.subject,
    html: option.html,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
