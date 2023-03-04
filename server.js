var express = require('express'); //Express使うよー定型分
var app = express(); //expressオブジェクトでappインスタンス作ったよー
const mysql = require('mysql'); //mysqlを使うためのやーつ
//bodyーparserとはHTML(ejs)のformのinputに入力された値を受け取れるようにするもの
const bodyParser = require('body-parser');
const Connection = require('mysql/lib/Connection');
const { Template } = require('ejs');
const http = express('http');

function handleDisconnect() {
  console.log('INFO.CONNECTION_DB: ');

  //mysql接続定数を代入
  const connection = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    port: 3306,
    user: 'b7a48a6bf21f12',
    password: '386777a7',
    database: 'heroku_436d62cc5e9f7c4',
  });

  //connection取得
  connection.connect((err) => {
    //MySQLへの接続の確認
    if (err) {
      console.log('ERROR.CONNECTION_DB: ', err);
      setTimeout(handleDisconnect, 1000);
    }
    console.log('success...MySQL接続成功!!!');
  });
  //error('PROTOCOL_CONNECTION_LOST')時に再接続
  connection.on('error', function (err) {
    console.log('ERROR.DB: ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('ERROR.CONNECTION_LOST: ', err);
      handleDisconnect();
    } else {
      throw err;
    }
  });
}
handleDisconnect();

app.set('view engine', 'ejs');
//publicフォルダ内のファイルを読み込めるようにする
app.use(express.static('public'));
//フォームの値を受け取るために必要な定型分
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 画面表示→get  データベース変更→post

app.get('/', (req, res) => {
  //指定したファイルを画面表示
  console.log('トップページ開きました : top.ejs');
  res.render('top.ejs');
});

app.get('/home', (req, res) => {
  connection.query('select * from it_memo;', (error, results) => {
    res.render('home.ejs', { memo: results });
  });
});

app.get('/login', (req, res) => {
  console.log('ログインページ開きました : login.ejs');
  res.render('login.ejs');
});

app.get('/new', (req, res) => {
  connection.query('select * from it_memo;', (error, results) => {
    res.render('new.ejs', { memo: results });
  });
});

app.post('/create', (req, res) => {
  //メモを追加するルーティング
  console.log(
    req.body.it_title + ' , ' + req.body.it_text + ' , ' + req.body.read_time
  );
  if (!req.body.it_title) {
    res.render('title_error.ejs');
  } else {
    //input要素にname属性を指定すると、オブジェクトの形で情報がサーバーに送信される。
    //よってサーバー側ではreq.body.name属性の値でフォームの値を取得で切る
    if (req.body.read_time === '') {
      //なぜかread_timeに未入力の場合。自動的にNULLが入らず、０でセット
      req.body.read_time = 0;
    }

    connection.query(
      'INSERT into it_memo(title, memo_text, read_time) values(?, ?, ?); ', // 挿入
      [req.body.it_title, req.body.it_text, req.body.read_time], //この値が？に入る
      (error, results) => {
        const id = results.insertId; //resultsオブジェクトのinsertIdを使用
        const index_id = '/index/' + id;
        res.redirect(index_id); //[/create]へ飛ぶと[/index]へリダイレクトしている →更新するとinsertされ続けるためリダイレクト活用
      }
    );
  }
});

app.get('/index', (req, res) => {
  console.log('マイページ開きました : index.ejs');
  res.render('index.ejs');
});
// .route('/index')
// .get(function (req, res) {
//   connection.query(
//     //indexに過去のリストを載せるためにもうひとつ作成（selectで全て表示するため）
//     'select * from it_memo',
//     (error, result) => {
//       connection.query(
//         //テーブルを結合してタブを表示
//         'select tab_hold.id, it_memo.title, it_memo.memo_text from tab_hold left join it_memo on tab_hold.id = it_memo.id;',
//         (error, results) => {
//           connection.query(
//             //ASはCOUNT(*)をcountDBに別名保存
//             'SELECT COUNT(*) AS countDB FROM tab_hold;',
//             (error, result_count) => {
//               connection.query(
//                 //解決次第削除
//                 'select * from tab_hold',
//                 (error, results_hold) => {
//                   connection.query(
//                     'select * from folder order by folder_order ASC',
//                     (error, result_folder) => {
//                       // 上のクエリ文が result に入る
//                       res.render('index.ejs', {
//                         old_memo: result,
//                         tab_memo: results,
//                         db_count: result_count[0].countDB, //テーブルの数が入る
//                         folderList: result_folder,
//                       });
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// })
// .post(function (req, res) {
//   //[色を付ける]を押下した場合
//   if (req.body.data == 'color') {
//     console.log(
//       `[POST受信] id : ${req.body.id} ,  color : ${req.body.color} `
//     );
//     connection.query(
//       'UPDATE it_memo SET title_color=? WHERE id=?',
//       [req.body.color, req.body.id],
//       (error, results) => {
//         console.log(`${req.body.color} 色にします`);
//         res.send({ response: req.body.color });
//       }
//     );
//     //[タイトルを変更する]を押下した場合
//   } else if (req.body.data == 'tab') {
//     console.log(`[POST(tab)] id : ${req.body.id}, title : ${req.body.title}`);
//     if (req.body.flg == 'etc') {
//       connection.query(
//         'select * from it_memo where id = ?',
//         [req.body.id],
//         (error, results) => {
//           //console.log(results);
//           connection.query(
//             //タブ追加時にtab_holdにも追加
//             'INSERT into tab_hold(id, tabTitle) values(?, ?);',
//             [req.body.id, req.body.title],
//             (error, result) => {
//               connection.query(
//                 'SELECT * from tab_hold;',
//                 [req.body.id, req.body.title],
//                 (error, result) => {
//                   console.log(result);
//                   res.send({ response: results[0], response1: result });
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'updateFocus') {
//       connection.query(
//         'UPDATE tab_hold SET focus = ?, pass = ? where id = ?',
//         [1, req.body.pass, req.body.id],
//         (error, result) => {
//           connection.query(
//             'UPDATE tab_hold SET focus = ? where id != ?',
//             [0, req.body.id],
//             (error, results) => {
//               res.send({ response: result });
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'updateOrder') {
//       connection.query(
//         'UPDATE tab_hold SET tabOrder = ? where id = ?',
//         [req.body.order, req.body.id],
//         (error, results) => {
//           res.send({ response: results });
//         }
//       );
//     } else if (req.body.flg == 'tabDesc') {
//       connection.query(
//         'SELECT * FROM tab_hold ORDER BY tabOrder;',
//         (error, results) => {
//           res.send({ response: results });
//         }
//       );
//     } else if (req.body.flg == 'info') {
//       connection.query('SELECT * FROM tab_hold;', (error, result) => {
//         res.send({ response: result });
//       });
//     } else if (req.body.flg == 'focusTab') {
//       connection.query(
//         'select * from tab_hold where focus = 1;',
//         (error, result) => {
//           res.send({ response: result[0] });
//         }
//       );
//     } else if (req.body.flg == 'tabDel') {
//       console.log(req.body.order);
//       connection.query(
//         'DELETE from tab_hold where id = ?',
//         [req.body.id],
//         (error, result) => {
//           connection.query(
//             'UPDATE tab_hold SET tabOrder = tabOrder - 1 WHERE tabOrder > ?; ',
//             [req.body.order],
//             (error, results) => {
//               res.send({ response: result });
//             }
//           );
//         }
//       );
//     }
//   } //追加後のDB更新
//   else if (req.body.data == 'addOrder') {
//     console.log(
//       `[POST(addOrder)] id: ${req.body.id}, order: ${req.body.order}`
//     );
//     connection.query(
//       'UPDATE folder SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?)',
//       [req.body.parent_id, req.body.order],
//       (error, result) => {
//         connection.query(
//           'UPDATE it_memo SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?)',
//           [req.body.parent_id, req.body.order],
//           (error, result) => {
//             if (req.body.pattern == 'folder') {
//               connection.query(
//                 'UPDATE folder SET folder_order =? WHERE id = ?',
//                 [req.body.order, req.body.id],
//                 (error, result) => {
//                   connection.query(
//                     'SELECT * FROM tab_hold WHERE focus = 1',
//                     (error, result) => {
//                       res.send({
//                         response: req.body.order,
//                         response: result.id,
//                       });
//                     }
//                   );
//                 }
//               );
//               //fileの場合
//             } else {
//               connection.query(
//                 'UPDATE it_memo SET folder_order =? WHERE id = ?',
//                 [req.body.order, req.body.id],
//                 (error, result) => {
//                   connection.query(
//                     'UPDATE tab_hold SET pass = ? WHERE id = ?',
//                     [req.body.pass, req.body.id],
//                     (error, result) => {
//                       connection.query(
//                         'SELECT * FROM tab_hold WHERE id = ?',
//                         [req.body.id],
//                         (error, result) => {
//                           res.send({
//                             response1: req.body.pass,
//                             response2: result[0].focus,
//                           });
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           }
//         );
//       }
//     );
//   }
//   //削除したフォルダの配下のファイルとフォルダを全て削除
//   else if (req.body.data == 'childFolder') {
//     let tmpIdArray = [];
//     let fileArray = [];
//     let folderArray = [];
//     let tmp;

//     console.log(`[POST(childFolder)]  id : ${req.body.id}`);

//     tmpIdArray.push(req.body.id); //削除したフォルダidを格納

//     while (tmpIdArray.length !== 0) {
//       tmpIdArray.forEach((parentId) => {
//         //console.log('parentID' + parentId);
//         req.body.file.forEach((file) => {
//           //console.log('ファイル' + file.id);
//           if (file.parent_id == parentId) {
//             //重複していなければ格納(格納されているのは削除した子要素以下のid。削除するため)
//             if (fileArray.indexOf(file.id) == -1) {
//               fileArray.push(file.id);
//             }
//           }
//         });
//         req.body.folder.forEach((folder) => {
//           //console.log('フォルダ' + folder.id);
//           if (folder.parent_id == parentId) {
//             //重複していなければ格納
//             if (folderArray.indexOf(folder.id) == -1) {
//               folderArray.push(folder.id);
//             }
//             if (tmpIdArray.indexOf(folder.id) == -1) {
//               tmpIdArray.push(folder.id);
//             }
//           }
//         });
//         tmp = parentId;
//       });
//       //配下を全て削除したフォルダをtmpIdArrayから削除
//       tmpIdArray.splice(tmpIdArray.indexOf(tmp), 1);
//     }
//     fileArray.forEach((file) => {
//       //ここでクエリを使用してファイル消す
//       connection.query(
//         'DELETE from it_memo where id =?',
//         [file],
//         (error, result) => {}
//       );
//     });
//     folderArray.forEach((folder) => {
//       //ここでクエリを使用してフォルダ消す
//       connection.query(
//         'DELETE from folder where id =?',
//         [folder],
//         (error, result) => {}
//       );
//     });
//     res.send({ response: fileArray });

//     //配下のフォルダのidを全て配列に格納している
//   } else if (req.body.data == 'folderChild') {
//     console.log(`[POST受信(folderChild)]  id : ${req.body.id}`);
//     let idArray = []; //最終的にcodejsに返す値
//     let parentIdArray = [];
//     parentIdArray.push(req.body.id);

//     connection.query('select * from folder', (error, results) => {
//       console.log(results);
//       while (parentIdArray.length !== 0) {
//         parentIdArray.forEach((parentId) => {
//           results.forEach((result) => {
//             if (parentId == result.parent_id) {
//               console.log(`id : ${result.id}, name: ${result.folder_name}`);
//               //重複していないなら格納する
//               if (idArray.indexOf(result.id) == -1) {
//                 idArray.push(result.id);
//               }
//               if (parentIdArray.indexOf(result.id) == -1) {
//                 parentIdArray.push(result.id);
//               }
//             }
//           });
//           parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
//         });
//       }
//       res.send({ response: idArray });
//     });
//     //フォルダの子ノートを全て取得する(passの更新に使用するため)
//   } else if (req.body.data == 'noteChild') {
//     console.log(`[POST受信(noteChild)]  id : ${req.body.id}`);
//     let idArray = []; //最終的にcodejsに返す値
//     let parentIdArray = [];
//     parentIdArray.push(req.body.id);

//     connection.query('select * from folder;', (error, result_folder) => {
//       connection.query('select * from it_memo;', (error, result_note) => {
//         while (parentIdArray.length !== 0) {
//           parentIdArray.forEach((parentId) => {
//             //まず配下のノート格納
//             result_note.forEach((note) => {
//               if (parentId == note.parent_id) {
//                 //重複していないなら格納する
//                 if (idArray.indexOf(note.id) == -1) {
//                   //idArray.push({ id: note.id, title: note.title });
//                   idArray.push(note.id);
//                 }
//               }
//             });
//             console.log(idArray);
//             result_folder.forEach((folder) => {
//               if (parentId == folder.parent_id) {
//                 //重複していないなら格納する
//                 if (parentIdArray.indexOf(folder.id) == -1) {
//                   parentIdArray.push(folder.id);
//                 }
//               }
//             });
//             //console.log(parentIdArray);
//             parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
//           });
//         }
//         setTimeout(() => {
//           console.log(idArray);
//           res.send({ response: idArray });
//         }, 500);
//       });
//     });
//   } else if (req.body.data == 'list') {
//     connection.query(
//       'select * from folder order by folder_order ASC',
//       (error, results) => {
//         connection.query(
//           'select * from it_memo order by folder_order ASC',
//           (error, result) => {
//             console.log(results);
//             console.log(result);
//             res.send({ response: results, response2: result });
//           }
//         );
//       }
//     );
//     //全削除ボタン
//   } else if (req.body.data == 'deleteALL') {
//     console.log(`データベースを全削除します`);
//     connection.query('DELETE from folder', (error, result) => {
//       connection.query('DELETE from it_memo', (error, result) => {
//         connection.query('DELETE from tab_hold', (error, result) => {
//           res.send({ response: result });
//         });
//       });
//     });
//     //フォルダの開き/閉じ判定
//   } else if (req.body.data == 'folder') {
//     console.log(
//       `[POST(folder)] フォルダ名 : ${req.body.folderName}, flg: ${req.body.flg}`
//     );
//     if (req.body.flg == 'newFolder') {
//       if (req.body.pattern == 'new') {
//         connection.query(
//           'INSERT into folder(folder_name, parent_id) values(?, ?); ',
//           [req.body.folderName, req.body.parentId],
//           (error, results) => {
//             connection.query(
//               //新規作成後にフォルダーidを取得するためのクエリ
//               'select * from folder order by id desc; ',
//               (error, result) => {
//                 res.send({
//                   response1: req.body.folderName,
//                   response2: result[0],
//                 });
//               }
//             );
//           }
//         );
//         //order
//       } else {
//         connection.query(
//           'UPDATE folder SET folder_order = ? WHERE id = ?',
//           [req.body.order, req.body.id],
//           (error, results) => {
//             res.send({
//               response: results,
//             });
//           }
//         );
//       }
//     } else if (req.body.flg == 'parentIDSame') {
//       connection.query(
//         'SELECT * from folder where id = ?', //D&D前の情報保持のため
//         [req.body.id],
//         (error, results) => {
//           connection.query(
//             'UPDATE folder SET parent_id = ?, folder_order = ? WHERE id = ?',
//             [req.body.parent_id, req.body.order, req.body.id],
//             (error, nonResult) => {
//               //D&Dしたフォルダのorderより大きいレコードにorderプラス１する。D&D前のorderとD&D後のorderが違う場合にプラス１
//               if (req.body.order != results[0].folder_order) {
//                 //下へD&D
//                 if (req.body.move == 'down') {
//                   connection.query(
//                     'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? )',
//                     [
//                       req.body.parent_id,
//                       req.body.id,
//                       results[0].folder_order,
//                       req.body.order,
//                     ],
//                     (error, result) => {
//                       connection.query(
//                         'UPDATE folder SET folder_order =  folder_order - 1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? )',
//                         [
//                           req.body.parent_id,
//                           req.body.id,
//                           results[0].folder_order,
//                           req.body.order,
//                         ],
//                         (error, result) => {}
//                       );
//                     }
//                   );
//                   //上へD&D
//                 } else {
//                   connection.query(
//                     'UPDATE it_memo SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )',
//                     [
//                       req.body.parent_id,
//                       req.body.id,
//                       req.body.order,
//                       results[0].folder_order,
//                     ],
//                     (error, result) => {
//                       connection.query(
//                         'UPDATE folder SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )',
//                         [
//                           req.body.parent_id,
//                           req.body.id,
//                           req.body.order,
//                           results[0].folder_order,
//                         ],
//                         (error, result) => {}
//                       );
//                     }
//                   );
//                 }
//               }
//               res.send({
//                 response1: req.body.parent_id,
//                 response2: req.body.order,
//               });
//             }
//           );
//         }
//       );
//     } //移動後は違うparent_id場合
//     else if (req.body.flg == 'parentIDDiffer') {
//       connection.query(
//         //移動前の階層での変化。対象の要素より、順番が大きいもののorderを-１する
//         'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?)',
//         [req.body.old_parent_id, req.body.old_order],
//         (error, result) => {
//           connection.query(
//             'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?)',
//             [req.body.old_parent_id, req.body.old_order],
//             (error, result) => {
//               connection.query(
//                 'UPDATE folder SET parent_id = ? WHERE id = ?',
//                 [req.body.parent_id, req.body.id],
//                 (error, result) => {
//                   res.send({ response: req.body.parent_id });
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'changeName') {
//       connection.query(
//         'UPDATE folder SET folder_name=?  WHERE id = ?',
//         [req.body.title, req.body.id],
//         (error, results) => {
//           res.send({ response: req.body.title });
//         }
//       );
//     } else if (req.body.flg == 'folderDel') {
//       connection.query(
//         'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? ',
//         [req.body.parentId, req.body.order],
//         (error, results) => {
//           connection.query(
//             'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? ',
//             [req.body.parentId, req.body.order],
//             (error, results) => {
//               connection.query(
//                 'DELETE from folder where id = ?',
//                 [req.body.id],
//                 (error, results) => {
//                   connection.query(
//                     'select * from it_memo',
//                     (error, result_n) => {
//                       connection.query(
//                         'select * from folder',
//                         (error, result_f) => {
//                           res.send({
//                             response: req.body.id,
//                             response1: result_n,
//                             response2: result_f,
//                           });
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'collapsableALL') {
//       //console.log('全て折り畳む');
//       connection.query(
//         'UPDATE folder SET closed = "on";',
//         (error, result) => {
//           res.send({ response: '閉じました' });
//         }
//       );
//     } else if (req.body.flg == 'expandableALL') {
//       //console.log('全て展開する');
//       connection.query(
//         'UPDATE folder SET closed = "off";',
//         (error, result) => {
//           res.send({ response: '開きました' });
//         }
//       );
//     } else if (req.body.flg == 'closed') {
//       //console.log('リストの開きを保存');
//       //開く→閉じる
//       if (req.body.closedFlg == 1) {
//         connection.query(
//           'UPDATE folder SET closed = "on" WHERE id = ?;',
//           [req.body.id],
//           (error, result) => {
//             res.send({ response: '閉じました' });
//           }
//         );
//         //開く→閉じる
//       } else {
//         connection.query(
//           'UPDATE folder SET closed = "off" WHERE id = ?;',
//           [req.body.id],
//           (error, result) => {
//             res.send({ response: '開きました' });
//           }
//         );
//       }
//     }
//   } else if (req.body.data == 'note') {
//     console.log(`[POST受信(newFile)] title : ${req.body.title}`);
//     if (req.body.flg == 'newNote') {
//       if (req.body.pattern == 'new') {
//         connection.query(
//           'INSERT into it_memo(title, parent_id) values(?, ?); ', // 挿入
//           [req.body.title, req.body.parentId], //この値が？に入る
//           (error, results) => {
//             connection.query(
//               'select * from  it_memo order by id desc;',
//               (error, result) => {
//                 res.send({
//                   response1: req.body.title,
//                   response2: result[0],
//                 });
//               }
//             );
//           }
//         );
//         //order
//       } else {
//         connection.query(
//           'UPDATE it_memo SET folder_order = ? WHERE id = ?',
//           [req.body.order, req.body.id], //この値が？に入る
//           (error, results) => {
//             res.send({
//               response: req.body.order,
//             });
//           }
//         );
//       }
//     } else if (req.body.flg == 'noteKeep') {
//       connection.query(
//         'UPDATE it_memo SET title = ?, memo_text = ?, saved_time = ? WHERE id = ?',
//         [
//           req.body.titleContent,
//           req.body.memoContent,
//           req.body.time,
//           req.body.id,
//         ],
//         (error, results) => {
//           connection.query(
//             'select * from it_memo where id = ?;',
//             [req.body.id],
//             (error, result) => {
//               connection.query(
//                 'UPDATE tab_hold SET tabTitle = ? WHERE id = ?;',
//                 [req.body.titleContent, req.body.id],
//                 (error, no_Result) => {
//                   res.send({
//                     response1: req.body.time,
//                     response2: result[0],
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'delete') {
//       connection.query(
//         'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? ',
//         [req.body.parentId, req.body.order],
//         (error, results) => {
//           connection.query(
//             'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? ',
//             [req.body.parentId, req.body.order],
//             (error, results) => {
//               connection.query(
//                 'DELETE from it_memo where id = ?',
//                 [req.body.id],
//                 (error, results) => {
//                   connection.query(
//                     'select * from it_memo',
//                     (error, result_n) => {
//                       connection.query(
//                         'select * from folder',
//                         (error, result_f) => {
//                           res.send({
//                             response: req.body.id,
//                             response1: result_n,
//                             response2: result_f,
//                           });
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'parentIDSame') {
//       //parentIdは変化しないパターン(同じ階層)
//       connection.query(
//         'SELECT * from it_memo where id = ?',
//         [req.body.id],
//         (error, results) => {
//           connection.query(
//             'UPDATE it_memo SET parent_id = ?, folder_order = ?  WHERE id = ?',
//             [req.body.parent_id, req.body.order, req.body.id],
//             (error, result) => {
//               //D&Dした結果parent_idが変わった結果(移動していない場合でないとき)
//               if (req.body.order != results[0].folder_order) {
//                 if (req.body.move == 'down') {
//                   connection.query(
//                     'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? )',
//                     [
//                       req.body.parent_id,
//                       req.body.id,
//                       results[0].folder_order,
//                       req.body.order,
//                     ],
//                     (error, result) => {
//                       connection.query(
//                         'UPDATE folder SET folder_order =  folder_order - 1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? )',
//                         [
//                           req.body.parent_id,
//                           req.body.id,
//                           results[0].folder_order,
//                           req.body.order,
//                         ],
//                         (error, result) => {}
//                       );
//                     }
//                   );
//                   //上へD&D
//                 } else {
//                   connection.query(
//                     'UPDATE it_memo SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )',
//                     [
//                       req.body.parent_id,
//                       req.body.id,
//                       req.body.order,
//                       results[0].folder_order,
//                     ],
//                     (error, result) => {
//                       connection.query(
//                         'UPDATE folder SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )',
//                         [
//                           req.body.parent_id,
//                           req.body.id,
//                           req.body.order,
//                           results[0].folder_order,
//                         ],
//                         (error, result_se) => {
//                           //console.log(result_se);
//                         }
//                       );
//                     }
//                   );
//                 }
//               }
//               res.send({ response: req.body.parent_id });
//             }
//           );
//         }
//       );
//       //移動後は違うparent_id
//     } else if (req.body.flg == 'parentIDDiffer') {
//       connection.query(
//         //移動前の階層での変化。対象の要素より、順番が大きいもののorderを-１する
//         'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?)',
//         [req.body.old_parent_id, req.body.old_order],
//         (error, result_se) => {
//           connection.query(
//             'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?)',
//             [req.body.old_parent_id, req.body.old_order],
//             (error, result_se) => {
//               connection.query(
//                 'UPDATE it_memo SET parent_id = ? WHERE id = ?',
//                 [req.body.parent_id, req.body.id],
//                 (error, result) => {
//                   res.send({ response1: req.body.parent_id });
//                 }
//               );
//             }
//           );
//         }
//       );
//     } else if (req.body.flg == 'updatetime') {
//       console.log(`[POST受信(updatetime)] time : ${req.body.time}`);
//       connection.query(
//         'UPDATE it_memo SET saved_time = ? WHERE id = ?;',
//         [req.body.time, req.body.id],
//         (error, result) => {
//           res.send({ response: req.body.time });
//         }
//       );
//     } else if (req.body.flg == 'name') {
//       console.log(`[POST受信(name)] title : ${req.body.title}`);
//       connection.query(
//         'SELECT * FROM tab_hold WHERE id = ?',
//         [req.body.id],
//         (error, results) => {
//           //console.log(results);
//           // console.log(results[0].pass);

//           //タブを生成済みであれば(tab_holdに格納されていれば)
//           if (results.length != 0) {
//             //passカラムの値の変更前のタイトルを変更後に変換
//             let ans = results[0].pass.replace(
//               req.body.oldTitle,
//               req.body.title
//             );
//             console.log(ans);
//             connection.query(
//               'UPDATE it_memo SET title = ?  WHERE id = ?',
//               [req.body.title, req.body.id],
//               (error, result) => {
//                 connection.query(
//                   'UPDATE tab_hold SET tabTitle = ?, pass = ? WHERE id = ?',
//                   [req.body.title, ans, req.body.id],
//                   (error, result) => {
//                     connection.query(
//                       'SELECT * FROM tab_hold WHERE id = ?',
//                       [req.body.id],
//                       (error, result) => {
//                         res.send({
//                           response1: req.body.title,
//                           response2: result[0].pass,
//                           response3: result[0].focus,
//                         });
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//             //タブ未生成
//           } else {
//             connection.query(
//               'UPDATE it_memo SET title = ?  WHERE id = ?',
//               [req.body.title, req.body.id],
//               (error, result) => {
//                 res.send({ response1: req.body.title, response2: undefined });
//               }
//             );
//           }
//         }
//       );
//       //タブ押下時にメモの内容を表示する
//     } else if (req.body.flg == 'updatePass') {
//       connection.query(
//         'UPDATE tab_hold SET pass = ? WHERE id = ?;',
//         [req.body.pass, req.body.id],
//         (error, result) => {
//           res.send({ response: req.body.time });
//         }
//       );
//     }
//   } else {
//     console.log('dataで何も受け取ってません');
//   }
// });

app.listen(process.env.PORT || 8080, () => {
  console.log('Running at Port 8080...ローカルサーバー接続成功！！');
});
