const res = require('express/lib/response');
const JWT = require('jsonwebtoken');

//Cookieに保存しているトークンが認証できるかどうか確認
function check(req, res, next) {
  try {
    //復号
    const hashedId = req.cookies.hashedId;
    req.value = hashedId;
    //下記で続きを実行。res.render('index.ejs');
    next();
  } catch (err) {
    res.render('top.ejs');
  }
}

module.exports = check;
