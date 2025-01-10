import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEMail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
) => {
  const info = await transporter.sendMail({
    from, //'"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to, //'bar@example.com, baz@example.com', // list of receivers
    subject, //'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html, //'<b>Hello world?</b>', // html body
  });

  console.log('message sent: ', info.messageId);
};
