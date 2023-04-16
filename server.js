var express = require('express'); //Express使う定型分
var app = express(); //expressオブジェクトでappインスタンス作成
//bodyーparserとはHTML(ejs)のformのinputに入力された値を受け取れるようにするもの
const bodyParser = require('body-parser');
const { Template } = require('ejs');
const http = express('http');
//connectionだとmysqlとの通信が切れてしまうため、poolを使用
const pool = require('./db.js');
const mypage1 = require('./routes/mypage');
const mypage2 = require('./routes/postController/tabPostController');
const auth = require('./routes/auth');
const login = require('./routes/srv_login');
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

app.get('/', (req, res) => {
  //res.render('index.ejs');
  res.render('top.ejs');
});

//authというエンドポイントで./routes/authファイルでWebAPIを構築できる
app.use('/auth', auth);
app.use('/mypage', mypage1);
app.use('/mypage', mypage2);
app.use('/login', login);

app.listen(process.env.PORT || 8080, () => {
  console.log('サーバー接続成功');
});
