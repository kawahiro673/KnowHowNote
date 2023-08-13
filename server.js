var express = require('express'); //Express使う定型分
var app = express(); //expressオブジェクトでappインスタンス作成
//bodyーparserとはHTML(ejs)のformのinputに入力された値を受け取れるようにするもの
const bodyParser = require('body-parser');
const JWT = require('jsonwebtoken');
const { Template } = require('ejs');
const http = express('http');
//connectionだとmysqlとの通信が切れてしまうため、poolを使用
const pool = require('./db.js');
const mypage1 = require('./routes/mypage');
const tabPostController = require('./routes/postController/tabPostController');
const notePostController = require('./routes/postController/notePostController');
const folderPostController = require('./routes/postController/folderPostController');
const sharePostController = require('./routes/postController/sharePostController');
const auth = require('./routes/auth');
const login = require('./routes/srv_login');
const mailer = require('./routes/mailer');
const check = require('./routes/check');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
//publicフォルダ内のファイルを読み込めるようにする
app.use(express.static('public'));
//フォームの値を受け取るために必要な定型分
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// JSONでデータをやり取りしますよという指定
app.use(express.json());
app.use(cookieParser());

app.get('/', check, (req, res) => {
  const hashedId = req.value;
  res.redirect('/mypage/' + hashedId);
});

app.get('/change-password/:token', async (req, res) => {
  const token = req.params.token;
  console.log(req.params.token);

  try {
    const decodedToken = await JWT.verify(token, 'SECRET_KEY');
    console.log(decodedToken);
    // ここでトークンから得られた情報を使用して処理を行う
    res.json({ decodedToken });
    res.render('pass-change.ejs', { decodedToken });
  } catch (error) {
    // トークンが無効な場合や有効期限切れの場合のエラーハンドリング
    console.error('Invalid token:', error);
    res.status(400).send('Invalid token');
  }
});

//authというエンドポイントで./routes/authファイルでWebAPIを構築できる
app.use('/auth', auth);
app.use('/mypage', mypage1);
app.use('/tabPostController', tabPostController);
app.use('/notePostController', notePostController);
app.use('/folderPostController', folderPostController);
app.use('/sharePostController', sharePostController);
app.use('/login', login);
app.use('/mailer', mailer);

app.listen(process.env.PORT || 8080, () => {
  console.log('サーバー接続成功');
});
