import nodemailer from 'nodemailer';
// import SMTPTransport from 'nodemailer/lib/smtp-transport';

// interface ITransportersObj {
//   [propName: string]: nodemailer.Transporter<
//     SMTPTransport.SentMessageInfo,
//     SMTPTransport.Options
//   >;
// }

// const SMTP_ROOT_USER = process.env.SMTP_ROOT_USER as string;
// const SMTP_NOREPLY_USER = process.env.SMTP_NOREPLY_USER as string;
// const SMTP_SUPPORT_TEAM_USER = process.env.SMTP_SUPPORT_TEAM_USER as string;

// const transporters: ITransportersObj = {};

// transporters[SMTP_ROOT_USER] = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.SMTP_ROOT_USER,
//     pass: process.env.SMTP_ROOT_PASS,
//   },
// });

// transporters[SMTP_NOREPLY_USER] = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.SMTP_NOREPLY_USER,
//     pass: process.env.SMTP_NOREPLY_PASS,
//   },
// });

// transporters[SMTP_SUPPORT_TEAM_USER] = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.SMTP_SUPPORT_TEAM_USER,
//     pass: process.env.SMTP_SUPPORT_TEAM_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string,
) => {
  // const fromAddress = from.split('" ').pop()?.replace(/[<>]+/g, '');
  // const transporter = transporters[fromAddress as string];

  // if (!transporter) {
  //   throw new Error(
  //     `No transporter found for the provided "from" address: ${from}`,
  //   );
  // }

  const info = await transporter.sendMail({
    from, //'"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to, //'bar@example.com, baz@example.com', // list of receivers
    subject, //'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html, //'<b>Hello world?</b>', // html body
  });

  console.log('message sent: ', info.messageId);
};
