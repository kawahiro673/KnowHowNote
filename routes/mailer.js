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
    .then(async (userResult) => {
      // ユーザーが見つからなかった場合
      if (userResult.length === 0) {
        res.send({ msg: 'nothingUser' });
      } else if (userResult[0].Email === req.body.email) {
        const userName = userResult[0].UserName;
        const tmpPassword = generateRandomString(10);

        let hashedDummyPassword = await bcrypt.hash(tmpPassword, 10);

        pool.query(
          'UPDATE register_user SET DummyPassword = ? WHERE id = ?;',
          [hashedDummyPassword, userResult[0].id],
          (error, userResult) => {}
        );

        const mailOptions = {
          from: auth.user,
          to: req.body.email,
          subject: '【Know How Note】パスワード変更',
          text: `${userName}様\n\n日頃より「Know How Note」をご利用くださり誠にありがとうございます。あなたのアカウントについて、パスワードの変更を承りました。\n以下の仮パスワードを発行いたしましたので、これを使用してアカウントにログイン後、パスワードの変更を行ってください。\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n仮パスワード: ${tmpPassword}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n※当メールは送信専用メールアドレスから配信されています。このままご返信いただいてもお答えできませんのでご了承ください。\n\n※当メールに心当たりの無い場合は、誠に恐れ入りますが破棄して頂けますよう、よろしくお願いいたします。\n`,
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

module.exports = router;

//10文字の半角英数字をランダムに生成
function generateRandomString(length) {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}
