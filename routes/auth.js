const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router
  .route('/')
  .get((req, res) => {
    //指定したファイルを画面表示
    res.render('auth.ejs');
  })
  .post(async (req, res) => {
    if (req.body.flg === 'info') {
      pool.query('SELECT * FROM register_user;', (error, result) => {
        res.send({ response: result });
      });
    } else if (req.body.flg === 'cipher') {
      //bcryptモジュールを使用して暗号化(ソルト)
      let userName = req.body.username;
      let email = req.body.email;
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      pool.query(
        'INSERT INTO register_user (UserName, Email, HashedPassword) VALUES(?, ?, ?);',
        [userName, email, hashedPassword],
        (error, result) => {}
      );
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
      //ここでクラアントに返した値(token)をCookieに保存させる
      res.send({ token: token });
    }
  });

//ログイン用のAPI

module.exports = router;
