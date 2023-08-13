//Gmailは"https://zenn.dev/hisho/scraps/efbcb7cd2f7b82"を参考に、「OAuth 2.0」でメール送信するように設定を変更
const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//認証情報
const auth = {
  type: 'OAuth2',
  user: 'akanuma.9099@gmail.com',
  clientId:
    '755195789659-0lt6su9q88eq0585igj83b4m5ont4bbi.apps.googleusercontent.com',
  clientSecret: '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',
  refreshToken:
    '1//04_aWdS9pheLjCgYIARAAGAQSNwF-L9IrHvN4nWm4Th8Q2Bub24PndrddgDhDZZGm3THAbFv22Mt2bRwjxf9eUDjyhvYDNU52pDw',
};

const transport = {
  service: 'gmail',
  auth,
};

const transporter = nodemailer.createTransport(transport);

router.post('/', (req, res) => {
  let promise = new Promise((resolve, reject) => {
    resolve();
  });
  promise
    .then(() => {
      return new Promise((resolve, reject) => {
        pool.query(
          'SELECT * FROM register_user WHERE UserName = ?;',
          [req.body.userName],
          (error, userResult) => {
            if (error) {
              reject(error);
            } else {
              resolve(userResult);
            }
          }
        );
      });
    })
    .then((userResult) => {
      return new Promise((resolve, reject) => {
        // ユーザーが見つからなかった場合
        if (userResult.length === 0) {
          res.send({ msg: 'nothingUser' });
        } else if (userResult[0].Email === req.body.email) {
          const hashedId = bcrypt.hashSync(userResult[0].toString(), 10);
          const encodedId = encodeURIComponent(hashedId);
          const url = `https://nodejs-itnote-app.herokuapp.com/change-password/${encodedId}`;

          const mailOptions = {
            from: auth.user,
            to: req.body.email,
            subject: '【パスワード変更】Know How Note',
            text: `下記URLからパスワード変更してください。有効期限は24時間です。\n${url}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error:', error);
              res.status(500).send('Error sending email');
            } else {
              console.log('Email sent:', info.response);
              res.send({ msg: 'OK' });
            }
          });
        } else {
          res.send({ msg: 'nothingEmail' });
        }
      });
    });
});

module.exports = router;
