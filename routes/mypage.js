const router = require('express').Router();
const { append } = require('express/lib/response');
const pool = require('../db.js');
const JWT = require('jsonwebtoken');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const { request } = require('express');
const res = require('express/lib/response');
const { reject } = require('bcrypt/promises');
const { off } = require('../db.js');
const rules = require('nodemon/lib/rules');
const Connection = require('mysql/lib/Connection');
const PoolCluster = require('mysql/lib/PoolCluster');

router
  .route('/:hashedId')
  .get((req, res) => {
    const encodedId = req.params.hashedId.replace(/\//g, '%2F');
    res.render('index.ejs', { hashedId: encodedId });
  })
  .post((req, res) => {
    if (req.body.flg === 'color') {
      pool.query(
        'UPDATE it_memo SET title_color=? WHERE id=?',
        [req.body.color, req.body.id],
        (error, result) => {
          res.send({ response: req.body.color });
        }
      );
    } else if (req.body.flg === 'addOrder') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE folder SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?) AND (UserID = ?)',
              [req.body.parent_id, req.body.order, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE it_memo SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?) AND (UserID = ?)',
              [req.body.parent_id, req.body.order, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({
                    pattern: req.body.pattern,
                    resultDecoded,
                  });
                }
              }
            );
          });
        })
        .then(({ pattern, resultDecoded }) => {
          if (pattern === 'folder') {
            let promise1 = new Promise((resolve, reject) => {
              resolve(resultDecoded);
            });
            promise1
              .then((resultDecoded) => {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'UPDATE folder SET folder_order =? WHERE id = ?',
                    [req.body.order, req.body.id],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve(resultDecoded);
                      }
                    }
                  );
                });
              })
              .then((resultDecoded) => {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'SELECT * FROM tab_hold WHERE focus = 1 AND (UserID = ?)',
                    [resultDecoded[0].id],
                    (error, result) => {
                      res.send({
                        msg: '成功しました',
                      });
                    }
                  );
                });
              });
          } else if (pattern === 'file') {
            let promise1 = new Promise((resolve, reject) => {
              resolve();
            });
            promise1
              .then(() => {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'UPDATE it_memo SET folder_order =? WHERE id = ?',
                    [req.body.order, req.body.id],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve();
                      }
                    }
                  );
                });
              })
              .then(() => {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'SELECT * FROM tab_hold WHERE id = ?',
                    [req.body.id],
                    (error, result) => {
                      res.send({
                        msg: '成功しました',
                      });
                    }
                  );
                });
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send('Internal Server Error.(addOrder)');
              });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(addOrder)');
        });
    }
    //削除したフォルダの配下のファイルとフォルダを全て削除
    else if (req.body.flg === 'childFolder') {
      let tmpIdArray = [];
      let fileArray = [];
      let folderArray = [];
      let tmp;

      console.log(`[POST(childFolder)]  id : ${req.body.id}`);

      tmpIdArray.push(req.body.id); //削除したフォルダidを格納

      while (tmpIdArray.length !== 0) {
        tmpIdArray.forEach((parentId) => {
          //console.log('parentID' + parentId);
          req.body.file.forEach((file) => {
            //console.log('ファイル' + file.id);
            if (file.parent_id == parentId) {
              //重複していなければ格納(格納されているのは削除した子要素以下のid。削除するため)
              if (fileArray.indexOf(file.id) == -1) {
                fileArray.push(file.id);
              }
            }
          });
          req.body.folder.forEach((folder) => {
            //console.log('フォルダ' + folder.id);
            if (folder.parent_id == parentId) {
              //重複していなければ格納
              if (folderArray.indexOf(folder.id) == -1) {
                folderArray.push(folder.id);
              }
              if (tmpIdArray.indexOf(folder.id) == -1) {
                tmpIdArray.push(folder.id);
              }
            }
          });
          tmp = parentId;
        });
        //配下を全て削除したフォルダをtmpIdArrayから削除
        tmpIdArray.splice(tmpIdArray.indexOf(tmp), 1);
      }
      fileArray.forEach((file) => {
        //ここでクエリを使用してファイル消す
        pool.query(
          'DELETE from it_memo where id =?',
          [file],
          (error, result) => {}
        );
      });
      folderArray.forEach((folder) => {
        //ここでクエリを使用してフォルダ消す
        pool.query(
          'DELETE from folder where id =?',
          [folder],
          (error, result) => {}
        );
      });
      res.send({ response: fileArray });

      //配下のフォルダのidを全て配列に格納している
    } else if (req.body.flg === 'folderChild') {
      let idArray = []; //最終的にmain.jsに返す値
      let parentIdArray = [];
      parentIdArray.push(req.body.id);
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM folder WHERE UserID = ?',
              [resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  while (parentIdArray.length !== 0) {
                    parentIdArray.forEach((parentId) => {
                      results.forEach((result) => {
                        if (parentId == result.parent_id) {
                          //重複していないなら格納する
                          if (idArray.indexOf(result.id) == -1) {
                            idArray.push(result.id);
                          }
                          if (parentIdArray.indexOf(result.id) == -1) {
                            parentIdArray.push(result.id);
                          }
                        }
                      });
                      parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
                    });
                  }
                  res.send({ response: idArray });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(folderChild)');
        });
      //フォルダの子ノートを全て取得する(passの更新に使用するため)
    } else if (req.body.flg === 'noteChild') {
      let idArray = []; //最終的にcodejsに返す値
      let parentIdArray = [];
      parentIdArray.push(req.body.id);
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM folder WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result_folder) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({
                    result_folder,
                    resultDecoded,
                  });
                }
              }
            );
          });
        })
        .then(({ result_folder, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM it_memo WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result_note) => {
                if (error) {
                  reject(error);
                } else {
                  while (parentIdArray.length !== 0) {
                    parentIdArray.forEach((parentId) => {
                      //まず配下のノート格納
                      result_note.forEach((note) => {
                        if (parentId == note.parent_id) {
                          //重複していないなら格納する
                          if (idArray.indexOf(note.id) == -1) {
                            idArray.push(note.id);
                          }
                        }
                      });
                      result_folder.forEach((folder) => {
                        if (parentId == folder.parent_id) {
                          //重複していないなら格納する
                          if (parentIdArray.indexOf(folder.id) == -1) {
                            parentIdArray.push(folder.id);
                          }
                        }
                      });
                      parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
                    });
                  }
                  resolve();
                }
              }
            );
          });
        })
        .then(() => {
          res.send({ response: idArray });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(noteChild)');
        });
    } else if (req.body.flg === 'list') {
      //cookieの有効期限が切れたら自動的にログアウト
      //仕様上、期限切れ時に自動でログアウトされては困るので、リロードの際にのみログアウトする
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'select * from folder WHERE (Type IS NULL)  AND (UserID = ?) order by folder_order ASC ',
              [resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({ results, resultDecoded });
                }
              }
            );
          });
        })
        .then(({ results, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'select * from it_memo WHERE (Type != "Share") AND (UserID = ?) order by folder_order ASC',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({
                    response: results,
                    response2: result,
                    userName: resultDecoded[0].UserName,
                    id: resultDecoded[0].id,
                    user: resultDecoded[0],
                  });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(list)');
        });
    } else if (req.body.flg === 'deleteALL') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE from folder WHERE UserID = ?',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE from it_memo WHERE UserID = ?',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE from tab_hold WHERE UserID = ?',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ response: result });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(sharelist)');
        });

      //ログアウト時にcookie削除
    } else if (req.body.flg === 'cookiedelete') {
      //cookie削除
      res.setHeader('Set-Cookie', [
        'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/',
        'hashedId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/',
      ]);

      res.send({ msg: 'ログアウトします' });
    } else if (req.body.flg === 'ShareList') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        // .then((resultDecoded) => {
        //   return new Promise((resolve, reject) => {
        //     pool.query(
        //       'SELECT * FROM share_user WHERE UserID = ? ORDER BY id DESC LIMIT 100;',
        //       [resultDecoded[0].id],
        //       (error, result) => {
        //         if (error) {
        //           reject(error);
        //         } else {
        //           res.send({ shareResult: result });
        //         }
        //       }
        //     );
        //   });
        // });.then((resultDecoded) => {
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT id FROM share_user WHERE UserID = ? ORDER BY id DESC LIMIT 100;',
              [resultDecoded[0].id],
              (error, rows) => {
                if (error) {
                  reject(error);
                } else {
                  // 最新の100行のIDを取得
                  const idsToKeep = rows.map((row) => row.id);

                  // 最新の100行以外のレコードを削除
                  pool.query(
                    'DELETE FROM share_user WHERE UserID = ? AND id NOT IN (?);',
                    [resultDecoded[0].id, idsToKeep],
                    (error, deleteResult) => {
                      if (error) {
                        reject(error);
                      } else {
                        pool.query(
                          'SELECT * FROM share_user WHERE UserID = ? ORDER BY id DESC;',
                          [resultDecoded[0].id],
                          (error, selectResult) => {
                            if (error) {
                              reject(error);
                            } else {
                              res.send({ shareResult: selectResult });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          });
        });
    } else if (req.body.flg === 'RegisterUser') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      pool.query(
        'SELECT * FROM register_user WHERE UserName = ?;',
        [decoded.userName],
        (error, resultDecoded) => {
          res.send({
            user: resultDecoded[0],
            email: decoded.email,
          });
        }
      );
    } else if (req.body.flg === 'register_user_update') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE register_user SET SharePass = ? WHERE id = ?;',
              [req.body.sharePass, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'backgroundColor') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE register_user SET BackgroundColor = ? WHERE id = ?;',
              [req.body.color, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        });
    } else if (req.body.flg === 'inquiry') {
      pool.query(
        'INSERT INTO inquiry (user, date, type, content) values(?, ?, ?, ?);',
        [req.body.user, req.body.date, req.body.type, req.body.content],
        (error, result) => {
          res.send({ msg: '成功' });
        }
      );
    } else if (req.body.flg === 'shareFunctionCheckBoxFlg') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE register_user SET ShareFlg = ? WHERE id = ?;',
              [req.body.checkbox, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'Authentication_ID') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE Authentication_ID = ?;',
              [req.body.Authentication_ID],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  const user = result.find(
                    (user) =>
                      user.Authentication_ID === req.body.Authentication_ID
                  );
                  if (!user) {
                    return res.send({ msg: 'NG' });
                  }
                  resolve({ user: user, resultDecoded: resultDecoded });
                }
              }
            );
          });
        })
        .then(({ user, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM friend_List WHERE user_name = ? AND UserID = ?;',
              [user.UserName, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  if (result.length > 0) {
                    res.send({ userName: user.UserName, msg: 'already' });
                  } else {
                    resolve({ user: user, resultDecoded: resultDecoded });
                  }
                }
              }
            );
          });
        })
        .then(({ user, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT INTO friend_list (user_name, date, UserID, Changed_Name, User_Group) values(?, ?, ?, ?, ?);',
              [
                user.UserName,
                req.body.time,
                resultDecoded[0].id,
                user.UserName,
                'なし',
              ],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ userName: user.UserName, msg: 'OK' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'friend-list-get') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM friend_list WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ friend: result });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'friend-list-delete') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE from friend_list where user_name = ? AND  UserID = ?;',
              [req.body.name, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'friend-list-name-change') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE friend_list SET Changed_Name = ? WHERE id = ?;',
              [req.body.name, req.body.id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'group_add') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT INTO group_list (User_Group, UserID) values(?, ?);',
              [req.body.groupName, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'group_get') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM group_list WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result) => {
                res.send({ groupResults: result });
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'group_update') {
      pool.query(
        'UPDATE friend_list SET User_Group = ? WHERE id = ?;',
        [req.body.group, req.body.id],
        (error, result) => {
          res.send({ msg: '成功' });
        }
      );
    } else if (req.body.flg === 'group_delete') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE FROM group_list WHERE UserID = ? AND User_Group = ?;',
              [resultDecoded[0].id, req.body.group],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE friend_list SET User_Group = ? WHERE UserID = ? AND User_Group = ?;',
              ['なし', resultDecoded[0].id, req.body.group],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ msg: '成功' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'group_info') {
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE UserName = ?;',
              [decoded.userName],
              (error, resultDecoded) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM friend_list WHERE UserID = ? AND User_Group = ?;',
              [resultDecoded[0].id, req.body.group],
              (error, friendResult) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ friendResult: friendResult });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else {
      console.log('flgで何も受け取ってません');
    }
  });

module.exports = router;
