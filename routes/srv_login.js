const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router
  .route('/')
  .get((req, res) => {
    res.render('login.ejs');
  })
  .post(async (req, res) => {
    let email = req.body.email;
    if (req.body.flg === 'info') {
      pool.query('SELECT * FROM register_user;', async (error, result) => {
        const user = result.find((user) => user.Email === req.body.email);
        //console.log(user);
        if (!user) {
          res.send({
            message: 'メールアドレスまたはパスワードが間違っています',
          });
        }
        //パスワードの復号・照合(true or falseを返す)
        const isMatch = await bcrypt.compare(
          req.body.password,
          user.HashedPassword
        );
        if (!isMatch) {
          res.send({
            message: 'メールアドレスまたはパスワードが間違っています',
          });
        }

        //クライアントへJWTの発行(クライアント側のトークンはローカルストレージに保存するのはだめ。Cookieを使って保存する。)
        const token = await JWT.sign(
          {
            email,
          },
          'SECRET_KEY', //秘密鍵。envファイルとかに隠す。
          {
            expiresIn: '24h',
          }
        );

        const options = {
          httpOnly: true, // JavaScriptからアクセスできないようにする
          maxAge: 60, // 有効期限を設定
          // secure: process.env.NODE_ENV === 'production', // HTTPS上でのみ送信する
          // sameSite: 'Strict', // 同一ドメインからしかCookieを送信できなくする
        };

        res.cookie('token', token, options);

        res.render('index.ejs');
      });
    }
  });

module.exports = router;
