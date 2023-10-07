const res = require('express/lib/response');
const JWT = require('jsonwebtoken');

//Cookieに保存しているトークンが
function check(req, res, next) {
  try {
    const token = req.cookies.token;
    //復号する。認証できるかどうか確認
    const decoded = JWT.verify(token, process.env.Token_KEY);
    const hashedId = req.cookies.hashedId;
    req.value = hashedId;

    //下記で続きを実行、今回の場合は res.render('index.ejs');
    next();
  } catch (err) {
    res.render('top.ejs');
  }
}

module.exports = check;
