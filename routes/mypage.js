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
  .route('/')
  .get((req, res) => {
    res.render('index.ejs');
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
                    resultDecoded: resultDecoded,
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
                    result_folder: result_folder,
                    resultDecoded: resultDecoded,
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
                  resolve({ results: results, resultDecoded: resultDecoded });
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
      res.setHeader(
        'Set-Cookie',
        'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/'
      );
      res.render('top.ejs');
    } else if (req.body.flg === 'getuser') {
      let nothingUser = [];
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      const userNames = Array.isArray(req.body.name)
        ? req.body.name
        : [req.body.name]; // 名前を配列として受け取る
      userNames
        .reduce((promiseChain, name) => {
          return promiseChain
            .then(() => {
              return new Promise((resolve, reject) => {
                pool.query('SELECT * FROM register_user;', (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    const user = result.find((user) => user.UserName === name);
                    if (!user) {
                      nothingUser.push(name);
                      resolve({ skip: true }); // ユーザーが見つからなくても次のユーザーの処理に進む
                    } else {
                      resolve({ user });
                    }
                  }
                });
              });
            })
            .then(({ skip, user }) => {
              if (skip) {
                return Promise.resolve({ skip: true });
              } else {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'INSERT INTO it_memo (title, memo_text, Type, UserID) (SELECT title, memo_text, ?, ? FROM it_memo WHERE id = ?);',
                    ['Share', user.id, req.body.id],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve({ user });
                      }
                    }
                  );
                });
              }
            })
            .then(({ skip, user }) => {
              if (skip) {
                return Promise.resolve({ skip: true });
              } else {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'SELECT * FROM register_user WHERE Email = ?;',
                    [decoded.email],
                    (error, resultDecoded) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve({ resultDecoded: resultDecoded, user: user });
                      }
                    }
                  );
                });
              }
            })
            .then(({ skip, resultDecoded, user }) => {
              //DBに格納されていないユーザーが参照してしまうと、余計な情報が格納されてしまうため(存在しないユーザーには共有されないようにしているため)
              if (skip) {
                return Promise.resolve({ skip: true });
              } else {
                return new Promise((resolve, reject) => {
                  pool.query(
                    'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID) values(?, ?, ?, ?);',
                    [name, req.body.time, req.body.title, resultDecoded[0].id],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        resolve();
                      }
                    }
                  );
                });
              }
            });
        }, Promise.resolve())
        .then(() => {
          res.send({ message: '共有しました', nothingUser: nothingUser });
        })
        .catch((error) => {
          console.error(error);
          res
            .status(500)
            .json({ message: error.message, nothing: nothingUser });
        });
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
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
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
              'SELECT * FROM share_user WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ shareResult: result });
                }
              }
            );
          });
        });
    } else {
      console.log('flgで何も受け取ってません');
    }
  });

module.exports = router;
