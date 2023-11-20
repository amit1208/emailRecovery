
import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.google.com",
  port: 587,
  secure: true,
  auth: {
    user: "shivarajput.chauhan1991@gmail.com",
    pass: "Mynameis@123",
  },
});

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

export default transporter;

