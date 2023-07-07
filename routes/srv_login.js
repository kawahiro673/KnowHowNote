const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { redirect } = require('express/lib/response');

router.post('/', async (req, res) => {
  let userName = req.body.username;
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
          userName,
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

      //最終ログイン日時を格納
      const time = currentTimeGet();
      pool.query(
        'UPDATE register_user SET LoginDate = ? WHERE id = ?;',
        [time, user.id],
        (error, result) => {}
      );

      return res.send({ message: 'ok', url: url });
    });
  }
});

module.exports = router;

const currentTimeGet = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};
