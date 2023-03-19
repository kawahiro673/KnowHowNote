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
    if (req.body.flg === 'info') {
      pool.query('SELECT * FROM register_user;', async (error, result) => {
        const user = result.find((user) => user.Email === req.body.email);
        if (!user) {
          return res.status(400).json([
            {
              message: 'そのユーザは存在しません',
            },
          ]);
        }
        //パスワードの復号・照合(true or falseを返す)
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].HashedPassword
        );
        if (!isMatch) {
          return res.status(400).json([
            {
              message: 'パスワードが異なります',
            },
          ]);
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
        //ここでクラアントに返した値(token)をCookieに保存させる
        res.send({ token: token });
      });
    }
  });

module.exports = router;
