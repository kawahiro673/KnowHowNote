const res = require('express/lib/response');
const JWT = require('jsonwebtoken');
//require('dotenv').config();

//Cookieに保存しているトークンが
function check(req, res, next) {
  try {
    //承認用のトークン設定
    const token =
      'eyJhbGciOiJIUzI1NdWNoaUBnbWFpbC5jb20iLCJpYXQiOjE2ODAwMTM5MjksImV4cCI6MTY4MDEwMDMyOX0.AsjD-cmtiOiSl4pZFMtHjRJ1Y60M0IS-VcoK1NsHclc';
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

module.exports = check;
