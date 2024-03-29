const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

//認証情報
const auth = {
  type: 'OAuth2',
  user: 'knowhownote.info@gmail.com',
  clientId: process.env.Email_ClientID,
  clientSecret: process.env.Client_Secret,
  refreshToken: process.env.Refresh_Token,
};
const transport = {
  service: 'gmail',
  auth,
};
const transporter = nodemailer.createTransport(transport);

router.post('/', async (req, res) => {
  if (req.body.flg === 'RegisterUser') {
    const token = req.cookies.token;
    const decoded = JWT.verify(token, process.env.Token_KEY);
    pool.query(
      'SELECT * FROM register_user WHERE UserName = ?;',
      [decoded.userName],
      (error, resultDecoded) => {
        res.send({
          user: resultDecoded[0],
        });
      }
    );
  } else if (req.body.flg === 'backgroundColor') {
    getUserDataByToken(req).then((resultDecoded) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'UPDATE register_user SET BackgroundColor = ? WHERE id = ?;',
          [req.body.color, resultDecoded[0].id],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              res.send({ msg: '成功' });
            }
          }
        );
      });
    });
  } else if (req.body.flg === 'inquiry') {
    pool.query(
      'INSERT INTO inquiry (user, date, type, content) values(?, ?, ?, ?);',
      [req.body.user, req.body.date, req.body.type, req.body.content],
      (error, result) => {
        res.send({ msg: '成功' });
      }
    );
  } else if (req.body.flg === 'shareFunctionCheckBoxFlg') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE register_user SET ShareFlg = ? WHERE id = ?;',
            [req.body.checkbox, resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ msg: '成功' });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  } else if (req.body.flg === 'EmailUpdte') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query('SELECT * FROM register_user;', (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(resultDecoded);
            }
          });
        });
      })
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE register_user SET Email = ? WHERE id = ?;',
            [req.body.email, resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                const mailOptions = {
                  from: auth.user,
                  to: req.body.email,
                  subject: '【Know How Note】メールアドレス変更',
                  text: `${resultDecoded[0].UserName}様\n\n日頃より「Know How Note」をご利用くださり誠にありがとうございます。\nあなたのアカウントについて、こちらのアドレスで「メールアドレス変更」を承りました。\n\n※当メールは送信専用メールアドレスから配信されています。このままご返信いただいてもお答えできませんのでご了承ください。\n\n※当メールに心当たりの無い場合は、誠に恐れ入りますが破棄して頂けますよう、よろしくお願いいたします。\n`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('Error:', error);
                    res.status(500).send('Error sending email');
                  } else {
                    res.send({ msg: '更新完了しました' });
                  }
                });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message });
      });
  } else if (req.body.flg === 'PassCheck') {
    try {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, process.env.Token_KEY);

      const resultDecoded = await new Promise((resolve, reject) => {
        pool.query(
          'SELECT * FROM register_user WHERE UserName = ?;',
          [decoded.userName],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });
      const isMatch = await bcrypt.compare(
        req.body.password,
        resultDecoded[0].HashedPassword
      );
      if (isMatch) {
        let hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        pool.query(
          'UPDATE register_user SET HashedPassword = ?, DummyPassword = ? WHERE id = ?;',
          [hashedPassword, null, resultDecoded[0].id],
          (error, result) => {}
        );
      }
      res.send({
        isMatch: isMatch,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
});

module.exports = router;
