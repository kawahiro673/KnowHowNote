var express = require('express'); //Express使う定型分
var app = express(); //expressオブジェクトでappインスタンス作成
//bodyーparserとはHTML(ejs)のformのinputに入力された値を受け取れるようにするもの
const bodyParser = require('body-parser');
const { Template } = require('ejs');
const http = express('http');
//connectionだとmysqlとの通信が切れてしまうため、poolを使用
const pool = require('./db.js');
const mypage = require('./routes/mypage');

app.set('view engine', 'ejs');
//publicフォルダ内のファイルを読み込めるようにする
app.use(express.static('public'));
//フォームの値を受け取るために必要な定型分
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// JSONでデータをやり取りしますよという指定
app.use(express.json());
//[/mypage]で開ける。app.use(express.json());でjsonを使えるようにした後でないとjsonを読み込めない
app.use('/mypage', mypage);

app.get('/', (req, res) => {
  //指定したファイルを画面表示
  //console.log('新規登録 : top.ejs');
  res.render('register.ejs');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('サーバー接続成功！！');
});
