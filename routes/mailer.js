const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kmcnt673.9099@gmail.com',
    pass: '9099asaa',
  },
});

router.post('/', (req, res) => {
  const mailOptions = {
    from: 'kmcnt673.9099@gmail.com',
    to: req.body.email,
    subject: 'Test Email',
    text: 'This is a test email.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send({ msg: 'Email sent successfully' });
    }
  });
});

module.exports = router;

// // Nodemailerの設定
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // 使用するメールサービス (Gmailの場合)
//   auth: {
//     user: 'your_email@gmail.com', // 送信元のGmailアドレス
//     pass: 'your_password', // Gmailアカウントのパスワード
//   },
// });

// // 送信するメールの設定
// const mailOptions = {
//   from: 'your_email@gmail.com', // 送信元のGmailアドレス
//   to: 'recipient@example.com', // 送信先のメールアドレス
//   subject: 'Test Email', // メールの件名
//   text: 'This is a test email.', // メールの本文
// };

// // メールを送信する
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.log('Error:', error);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });
