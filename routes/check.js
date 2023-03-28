const res = require('express/lib/response');
const JWT = require('jsonwebtoken');
//require('dotenv').config();

//Cookieに保存しているトークンが
function auth(req, res, next) {
  try {
    //承認用のトークン設定
    const token = 'ここにCookieのトークンを取得?';
    //復号する。認証できるかどうか確認
    const decoded = JWT.verify(
      token,
      'SECRET_KEY' //秘密鍵。envファイルとかに隠す。
    );
    console.log(decoded);
    //下記で続きを実行、今回の場合は res.render('index.ejs');
    next();
  } catch (err) {
    //return res.redirect('/login');
    res.render('login.ejs');
  }
}

module.exports = auth;
