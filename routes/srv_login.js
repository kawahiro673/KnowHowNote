const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { redirect } = require('express/lib/response');

// router.post('/', async (req, res) => {
//   let email = req.body.email;
//   if (req.body.flg === 'info') {
//     pool.query('SELECT * FROM register_user;', async (error, result) => {
//       const user = result.find((user) => user.Email === req.body.email);
//       //console.log(user);
//       if (!user) {
//         return res.send({
//           message: 'メールアドレスまたはパスワードが間違っています',
//         });
//       }
//       //パスワードの復号・照合(true or falseを返す)
//       const isMatch = await bcrypt.compare(
//         req.body.password,
//         user.HashedPassword
//       );
//       if (!isMatch) {
//         return res.send({
//           message: 'メールアドレスまたはパスワードが間違っています',
//         });
//       }

//       //クライアントへJWTの発行(クライアント側のトークンはローカルストレージに保存するのはだめ。Cookieを使って保存する。)
//       const token = await JWT.sign(
//         {
//           email,
//         },
//         'SECRET_KEY' //秘密鍵。envファイルとかに隠す。
//         // {
//         //   expiresIn: '24h',
//         // }
//       );

//       const options = {
//         httpOnly: true, // JavaScriptからアクセスできないようにする(document.cookieで取得もできない)
//         maxAge: 1000 * 60 * 360, // 有効期限を設定(ミリ秒) ６時間
//         // secure: process.env.NODE_ENV === 'production', // HTTPS上でのみ送信する
//         // sameSite: 'Strict', // 同一ドメインからしかCookieを送信できなくする
//       };

//       res.cookie('token', token, options);

//       return res.send({ message: 'ok', response: user.UserName });
//     });
//   }
// });

router.post('/', async (req, res) => {
  let email = req.body.email;
  if (req.body.flg === 'info') {
    pool.query('SELECT * FROM register_user;', async (error, result) => {
      const user = result.find((user) => user.Email === req.body.email);
      if (!user) {
        return res.send({
          message: 'メールアドレスまたはパスワードが間違っています',
        });
      }
      const isMatch = await bcrypt.compare(
        req.body.password,
        user.HashedPassword
      );
      if (!isMatch) {
        return res.send({
          message: 'メールアドレスまたはパスワードが間違っています',
        });
      }
      const token = await JWT.sign(
        {
          email,
        },
        'SECRET_KEY' // 秘密鍵。envファイルなどに隠して管理することが推奨されます。
      );

      // ユーザーIDをハッシュ化してURLに含める
      const hashedUserId = bcrypt.hashSync(user.id.toString(), 10);
      const url = `https://nodejs-itnote-app.herokuapp.com/mypage/${hashedUserId}`;

      const options = {
        httpOnly: true, // JavaScriptからアクセスできないようにする(document.cookieで取得もできない)
        maxAge: 1000 * 60 * 360, // 有効期限を設定(ミリ秒) ６時間
      };

      res.cookie('token', token, options);

      // return res.redirect(url); // ユーザーをマイページにリダイレクトする
      return res.send({ message: 'ok', url: url });
    });
  }
});

module.exports = router;
