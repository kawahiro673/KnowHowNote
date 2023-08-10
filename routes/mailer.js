const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'akanuma.9099@gmail.com',
//     pass: '9099asaa',
//   },
// });

const transport = {
  service: "gmail",
  auth,
};

//認証情報
const auth = {
  type: "OAuth2",
  user: "akanuma.9099@gmail.com",
  clientId: '755195789659-0lt6su9q88eq0585igj83b4m5ont4bbi.apps.googleusercontent.com',
  clientSecret: "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",
  refreshToken: "1//04_aWdS9pheLjCgYIARAAGAQSNwF-L9IrHvN4nWm4Th8Q2Bub24PndrddgDhDZZGm3THAbFv22Mt2bRwjxf9eUDjyhvYDNU52pDw",
};

const transporter = nodemailer.createTransport(transport);

router.post('/', (req, res) => {
  const mailOptions = {
    from: 'from mail address',
    to:auth.user,
    subject: 'Test Email',
    text: 'メール送信確認テスト',
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
