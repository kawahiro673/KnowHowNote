const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { redirect } = require('express/lib/response');

router.post('/', async (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  if (req.body.flg === 'info') {
    pool.query('SELECT * FROM register_user;', async (error, result) => {
      const user = result.find((user) => user.UserName === req.body.username);
      if (!user) {
        return res.send({
          message: 'ユーザー名またはパスワードが間違っています',
        });
      }
      const isMatch = await bcrypt.compare(
        req.body.password,
        user.HashedPassword
      );
      if (!isMatch) {
        return res.send({
          message: 'ユーザー名またはパスワードが間違っています',
        });
      }
      const token = await JWT.sign(
        {
          username,
        },
        'SECRET_KEY' // 秘密鍵。envファイルなどに隠して管理することが推奨されます。
      );

      // ユーザーIDをハッシュ化してURLに含める
      const hashedId = bcrypt.hashSync(user.id.toString(), 10);
      const encodedId = encodeURIComponent(hashedId);
      const url = `https://nodejs-itnote-app.herokuapp.com/mypage/${encodedId}`;

      const options = {
        httpOnly: true, // JavaScriptからアクセスできないようにする(document.cookieで取得もできない)
        maxAge: 1000 * 60 * 360, // 有効期限を設定(ミリ秒) ６時間
      };

      res.cookie('token', token, options);
      res.cookie('hashedId', encodedId, options);

      return res.send({ message: 'ok', url: url });
    });
  }
});

module.exports = router;
