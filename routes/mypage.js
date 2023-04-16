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

router
  .route('/')
  .get((req, res) => {
    res.render('index.ejs');
  })
  .post((req, res) => {
    if (req.body.data === 'color') {
      pool.query(
        'UPDATE it_memo SET title_color=? WHERE id=?',
        [req.body.color, req.body.id],
        (error, results) => {
          res.send({ response: req.body.color });
        }
      );
      // } else if (req.body.data === 'tab') {
      //   if (req.body.flg === 'clickTab') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });
      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'UPDATE tab_hold SET tabOrder = ?,focus = 1 where id = ?',
      //             [req.body.order, req.body.id],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'UPDATE tab_hold SET focus = 0 where id != ? AND (UserID = ?)',
      //             [req.body.id, resultDecoded[0].id],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: results });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(clickTab)');
      //       });
      //   } else if (req.body.flg === 'updateFocus') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });
      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject();
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'UPDATE tab_hold SET focus = ?, pass = ? where id = ?',
      //             [1, req.body.pass, req.body.id],
      //             (error, result) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve({ result: result, resultDecoded: resultDecoded });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then(({ result, resultDecoded }) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'UPDATE tab_hold SET focus = ? where id != ? AND (UserID = ?)',
      //             [0, req.body.id, resultDecoded[0].id],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: result });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(addOrder)');
      //       });
      //   } else if (req.body.flg === 'updateOrder') {
      //     pool.query(
      //       'UPDATE tab_hold SET tabOrder = ? where id = ?',
      //       [req.body.order, req.body.id],
      //       (error, results) => {
      //         res.send({ response: results });
      //       }
      //     );
      //   } else if (req.body.flg === 'tabDesc') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });
      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM tab_hold WHERE UserID = ? ORDER BY tabOrder;',
      //             [resultDecoded[0].id],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: results });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(tabDesc)');
      //       });
      //   } else if (req.body.flg === 'info') {
      //     pool.query('SELECT * FROM tab_hold;', (error, result) => {
      //       res.send({ response: result });
      //     });
      //   } else if (req.body.flg === 'focusTab') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });
      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'select * from tab_hold where focus = 1 AND (UserID = ?);',
      //             [resultDecoded[0].id],
      //             (error, result) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: result[0] });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(focusTab)');
      //       });
      //   } else if (req.body.flg === 'tabDel') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });

      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM it_memo WHERE id = ?',
      //             [req.body.id],
      //             (error, resultFocus) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'DELETE from tab_hold where id = ?',
      //             [req.body.id],
      //             (error, result) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve({ result: result, resultDecoded: resultDecoded });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then(({ result, resultDecoded }) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'UPDATE tab_hold SET tabOrder = tabOrder - 1 WHERE tabOrder > ? AND (UserID = ?); ',
      //             [req.body.order, resultDecoded[0].id],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: result });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(tabDel)');
      //       });
      //   } else if (req.body.flg === 'tabAdd') {
      //     const token = req.cookies.token;
      //     const decoded = JWT.verify(token, 'SECRET_KEY');
      //     let promise = new Promise((resolve, reject) => {
      //       resolve();
      //     });

      //     promise
      //       .then(() => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'SELECT * FROM register_user WHERE Email = ?;',
      //             [decoded.email],
      //             (error, resultDecoded) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 resolve(resultDecoded);
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .then((resultDecoded) => {
      //         return new Promise((resolve, reject) => {
      //           pool.query(
      //             'INSERT into tab_hold(id, tabTitle, pass, UserID) values(?, ?, ?, ?);',
      //             [
      //               req.body.id,
      //               req.body.title,
      //               req.body.pass,
      //               resultDecoded[0].id,
      //             ],
      //             (error, results) => {
      //               if (error) {
      //                 reject(error);
      //               } else {
      //                 res.send({ response: results });
      //               }
      //             }
      //           );
      //         });
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //         res.status(500).send('Internal Server Error.(tabAdd)');
      //       });
      //   }
    } else if (req.body.data === 'addOrder') {
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
                        response: req.body.order,
                        response: result.id,
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
                    'UPDATE tab_hold SET pass = ? WHERE id = ?',
                    [req.body.pass, req.body.id],
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
                      if (result[0] !== undefined) {
                        res.send({
                          response1: req.body.pass,
                          response2: result[0].focus,
                        });
                      } else {
                        res.send({
                          response1: req.body.pass,
                        });
                      }
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
    else if (req.body.data === 'childFolder') {
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
    } else if (req.body.data === 'folderChild') {
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
    } else if (req.body.data === 'noteChild') {
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
                  setTimeout(() => {
                    res.send({ response: idArray });
                  }, 500);
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(noteChild)');
        });
      // pool.query(
      //   'SELECT * FROM register_user WHERE Email = ?;',
      //   [decoded.email],
      //   (error, resultDecoded) => {
      //     pool.query(
      //       'SELECT * FROM folder WHERE UserID = ?;',
      //       [resultDecoded[0].id],
      //       (error, result_folder) => {
      //         pool.query(
      //           'SELECT * FROM it_memo WHERE UserID = ?;',
      //           [resultDecoded[0].id],
      //           (error, result_note) => {
      //             while (parentIdArray.length !== 0) {
      //               parentIdArray.forEach((parentId) => {
      //                 //まず配下のノート格納
      //                 result_note.forEach((note) => {
      //                   if (parentId == note.parent_id) {
      //                     //重複していないなら格納する
      //                     if (idArray.indexOf(note.id) == -1) {
      //                       //idArray.push({ id: note.id, title: note.title });
      //                       idArray.push(note.id);
      //                     }
      //                   }
      //                 });
      //                 console.log(idArray);
      //                 result_folder.forEach((folder) => {
      //                   if (parentId == folder.parent_id) {
      //                     //重複していないなら格納する
      //                     if (parentIdArray.indexOf(folder.id) == -1) {
      //                       parentIdArray.push(folder.id);
      //                     }
      //                   }
      //                 });
      //                 //console.log(parentIdArray);
      //                 parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
      //               });
      //             }
      //             setTimeout(() => {
      //               console.log(idArray);
      //               res.send({ response: idArray });
      //             }, 500);
      //           }
      //         );
      //       }
      //     );
      //   }
      // );
    } else if (req.body.data === 'list') {
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
              'select * from folder WHERE (Type IS NULL) AND (UserID = ?) order by folder_order ASC ',
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
              'select * from it_memo WHERE (Type IS NULL) AND (UserID = ?) order by folder_order ASC',
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
    } else if (req.body.data === 'sharelist') {
      //cookieの有効期限が切れたら自動的にログアウト
      //仕様上、自動でログアウトされては困るので、リロードの際にのみログアウトする
      const token = req.cookies.token;
      const decoded = JWT.verify(token, 'SECRET_KEY');
      let promise = new Promise((resolve, reject) => {
        resolve();
      });

      promise
        .then(() => {
          return new Promise((resolve, rejct) => {
            pool.query(
              'SELECT * FROM register_user WHERE Email = ?;',
              [decoded.email],
              (error, resultDecoded) => {
                if (error) {
                  rejct(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        })
        .then((resultDecoded) => {
          return new Promise((resolve, rejct) => {
            pool.query(
              'select * from folder WHERE (UserID = ?) AND (Type = "Share") order by folder_order ASC ',
              [resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  rejct(error);
                } else {
                  resolve({ results: results, resultDecoded: resultDecoded });
                }
              }
            );
          });
        })
        .then(({ results, resultDecoded }) => {
          return new Promise((resolve, rejct) => {
            pool.query(
              'select * from it_memo WHERE (UserID = ?) AND (Type = "Share") order by folder_order ASC',
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
      //全削除ボタン
    } else if (req.body.data === 'deleteALL') {
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
      //フォルダの開き/閉じ判定
    } else if (req.body.data === 'folder') {
      if (req.body.flg === 'newFolder') {
        if (req.body.pattern == 'new') {
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
                  'INSERT into folder(folder_name, parent_id, UserID) values(?, ?, ?);',
                  [req.body.folderName, req.body.parentId, resultDecoded[0].id],
                  (error, results) => {
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
                  //新規作成後にフォルダーidを取得するためのクエリ
                  'select * from folder order by id desc; ',
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      res.send({
                        response1: req.body.folderName,
                        response2: result[0],
                      });
                    }
                  }
                );
              });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Internal Server Error.(newFolder)');
            });
          //order
        } else {
          pool.query(
            'UPDATE folder SET folder_order = ? WHERE id = ?',
            [req.body.order, req.body.id],
            (error, results) => {
              res.send({
                response: results,
              });
            }
          );
        }
      } else if (req.body.flg === 'parentIDSame') {
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
                'SELECT * FROM folder WHERE id = ?', //D&D前の情報保持のため
                [req.body.id],
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
                'UPDATE folder SET parent_id = ?, folder_order = ? WHERE id = ?',
                [req.body.parent_id, req.body.order, req.body.id],
                (error, nonResult) => {
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
            //D&Dしたフォルダのorderより大きいレコードにorderプラス１する。D&D前のorderとD&D後のorderが違う場合にプラス１
            if (req.body.order != results[0].folder_order) {
              //下へD&D
              if (req.body.move == 'down') {
                let promise1 = new Promise((resolve, reject) => {
                  resolve();
                });
                promise1
                  .then(() => {
                    return new Promise((resolve, reject) => {
                      pool.query(
                        'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? ) AND (UserID = ?)',
                        [
                          req.body.parent_id,
                          req.body.id,
                          results[0].folder_order,
                          req.body.order,
                          resultDecoded[0].id,
                        ],
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
                        'UPDATE folder SET folder_order =  folder_order - 1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? ) AND (UserID = ?)',
                        [
                          req.body.parent_id,
                          req.body.id,
                          results[0].folder_order,
                          req.body.order,
                          resultDecoded[0].id,
                        ],
                        (error, result) => {
                          if (error) {
                            reject(error);
                          } else {
                            res.send({
                              response1: req.body.parent_id,
                              response2: req.body.order,
                            });
                          }
                        }
                      );
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    res.status(500).send('Internal Server Error.(newFolder)');
                  });
              }
              //上へD&D
            } else {
              let promise1 = new Promise((resolve, reject) => {
                resolve();
              });
              promise1
                .then(() => {
                  return new Promise((resolve, reject) => {
                    pool.query(
                      'UPDATE it_memo SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )  AND (UserID = ?)',
                      [
                        req.body.parent_id,
                        req.body.id,
                        req.body.order,
                        results[0].folder_order,
                        resultDecoded[0].id,
                      ],
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
                      'UPDATE folder SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? )  AND (UserID = ?)',
                      [
                        req.body.parent_id,
                        req.body.id,
                        req.body.order,
                        results[0].folder_order,
                        resultDecoded[0].id,
                      ],
                      (error, result) => {
                        if (error) {
                          reject(error);
                        } else {
                          res.send({
                            response1: req.body.parent_id,
                            response2: req.body.order,
                          });
                        }
                      }
                    );
                  });
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).send('Internal Server Error.(newFolder)');
                });
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(newFolder)');
          });
      } //移動後は違うparent_id場合
      else if (req.body.flg === 'parentIDDiffer') {
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
                //移動前の階層での変化。対象の要素より、順番が大きいもののorderを-１する
                'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
                [
                  req.body.old_parent_id,
                  req.body.old_order,
                  resultDecoded[0].id,
                ],
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
                'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
                [
                  req.body.old_parent_id,
                  req.body.old_order,
                  resultDecoded[0].id,
                ],
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
                'UPDATE folder SET parent_id = ? WHERE id = ?',
                [req.body.parent_id, req.body.id],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({ response: req.body.parent_id });
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(parentIDDiffer)');
          });
      } else if (req.body.flg === 'changeName') {
        pool.query(
          'UPDATE folder SET folder_name=? WHERE id = ?',
          [req.body.title, req.body.id],
          (error, results) => {
            res.send({ response: req.body.title });
          }
        );
      } else if (req.body.flg === 'folderDel') {
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
                'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND (UserID = ?)',
                [req.body.parentId, req.body.order, resultDecoded[0].id],
                (error, results) => {
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
                'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND (UserID = ?)',
                [req.body.parentId, req.body.order, resultDecoded[0].id],
                (error, results) => {
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
                'DELETE from folder where id = ?',
                [req.body.id],
                (error, results) => {
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
              pool.query('select * from it_memo', (error, result_n) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result_n);
                }
              });
            });
          })
          .then((result_n) => {
            return new Promise((resolve, reject) => {
              pool.query('select * from folder', (error, result_f) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({
                    response: req.body.id,
                    response1: result_n,
                    response2: result_f,
                  });
                }
              });
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(folderDel)');
          });
      } else if (req.body.flg === 'collapsableALL') {
        //console.log('全て折り畳む');
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
                'UPDATE folder SET closed = "on" WHERE UserID = ? ;',
                [resultDecoded[0].id],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({ response: '閉じました' });
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(collapsableALL)');
          });
      } else if (req.body.flg === 'expandableALL') {
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
                'UPDATE folder SET closed = "off" WHERE UserID = ?;',
                [resultDecoded[0].id],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({ response: '開きました' });
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(expandableALL)');
          });
      } else if (req.body.flg === 'closed') {
        //console.log('リストの開きを保存');
        //開く→閉じる
        if (req.body.closedFlg == 1) {
          pool.query(
            'UPDATE folder SET closed = "on" WHERE id = ?;',
            [req.body.id],
            (error, result) => {
              res.send({ response: '閉じました' });
            }
          );
          //開く→閉じる
        } else {
          pool.query(
            'UPDATE folder SET closed = "off" WHERE id = ?;',
            [req.body.id],
            (error, result) => {
              res.send({ response: '開きました' });
            }
          );
        }
      }
    } else if (req.body.data === 'note') {
      if (req.body.flg === 'newNote') {
        if (req.body.pattern == 'new') {
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
                  'INSERT into it_memo(title, parent_id, UserID) values(?, ?, ?); ', // 挿入
                  [req.body.title, req.body.parentId, resultDecoded[0].id], //この値が？に入る
                  (error, results) => {
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
                  'SELECT * FROM  it_memo ORDER BY id DESC;',
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      res.send({
                        response1: req.body.title,
                        response2: result[0],
                      });
                    }
                  }
                );
              });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Internal Server Error.(newNote)');
            });
          //order
        } else {
          pool.query(
            'UPDATE it_memo SET folder_order = ? WHERE id = ?',
            [req.body.order, req.body.id], //この値が？に入る
            (error, results) => {
              res.send({
                response: req.body.order,
              });
            }
          );
        }
      } else if (req.body.flg === 'noteKeep') {
        let promise = new Promise((resolve, reject) => {
          resolve();
        });
        promise
          .then(() => {
            return new Promise((resolve, reject) => {
              pool.query(
                'UPDATE it_memo SET title = ?, memo_text = ?, saved_time = ? WHERE id = ?',
                [
                  req.body.titleContent,
                  req.body.memoContent,
                  req.body.time,
                  req.body.id,
                ],
                (error, results) => {
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
                'select * from it_memo where id = ?;',
                [req.body.id],
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
                'UPDATE tab_hold SET tabTitle = ?, pass = ? WHERE id = ?;',
                [req.body.titleContent, req.body.pass, req.body.id],
                (error, no_Result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({
                      response1: req.body.time,
                      response2: result[0],
                    });
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(noteKeep)');
          });
      } else if (req.body.flg === 'delete') {
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
                'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND UserID = ?',
                [req.body.parentId, req.body.order, resultDecoded[0].id],
                (error, results) => {
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
                'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND UserID = ?',
                [req.body.parentId, req.body.order, resultDecoded[0].id],
                (error, results) => {
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
                'DELETE from it_memo where id = ?',
                [req.body.id],
                (error, results) => {
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
              pool.query('select * from it_memo', (error, result_n) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result_n);
                }
              });
            });
          })
          .then((result_n) => {
            return new Promise((resolve, reject) => {
              pool.query('select * from folder', (error, result_f) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({
                    response: req.body.id,
                    response1: result_n,
                    response2: result_f,
                  });
                }
              });
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(delete)');
          });
      } else if (req.body.flg === 'parentIDSame') {
        //parentIdは変化しないパターン(同じ階層)
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
                'SELECT * from it_memo where id = ?',
                [req.body.id],
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
                'UPDATE it_memo SET parent_id = ?, folder_order = ?  WHERE id = ?',
                [req.body.parent_id, req.body.order, req.body.id],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    //D&Dした結果parent_idが変わった結果(移動していない場合でないとき)
                    if (req.body.order != results[0].folder_order) {
                      if (req.body.move == 'down') {
                        let promise1 = new Promise((resolve, reject) => {
                          resolve();
                        });
                        promise1
                          .then(() => {
                            return new Promise((resolve, reject) => {
                              pool.query(
                                'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? ) AND (UserID = ?)',
                                [
                                  req.body.parent_id,
                                  req.body.id,
                                  results[0].folder_order,
                                  req.body.order,
                                  resultDecoded[0].id,
                                ],
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
                                'UPDATE folder SET folder_order =  folder_order - 1 where (parent_id = ?) AND (id != ?) AND ( ? < folder_order AND  folder_order <= ? ) AND (UserID = ?)',
                                [
                                  req.body.parent_id,
                                  req.body.id,
                                  results[0].folder_order,
                                  req.body.order,
                                  resultDecoded[0].id,
                                ],
                                (error, result) => {
                                  if (error) {
                                    reject(error);
                                  } else {
                                    res.send({ response: req.body.parent_id });
                                  }
                                }
                              );
                            });
                          })
                          .catch((error) => {
                            console.error(error);
                            res
                              .status(500)
                              .send('Internal Server Error.(parentIDSame)');
                          });
                      } //上へD&D
                    } else {
                      let promise1 = new Promise((resolve, reject) => {
                        resolve();
                      });
                      promise1
                        .then(() => {
                          return new Promise((resolve, reject) => {
                            pool.query(
                              'UPDATE it_memo SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? ) AND (UserID = ?)',
                              [
                                req.body.parent_id,
                                req.body.id,
                                req.body.order,
                                results[0].folder_order,
                                resultDecoded[0].id,
                              ],
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
                              'UPDATE folder SET folder_order =  folder_order + 1 where (parent_id = ?) AND (id != ?) AND ( ? <= folder_order AND  folder_order < ? ) AND (UserID = ?)',
                              [
                                req.body.parent_id,
                                req.body.id,
                                req.body.order,
                                results[0].folder_order,
                                resultDecoded[0].id,
                              ],
                              (error, result_se) => {
                                if (error) {
                                  reject(error);
                                } else {
                                  res.send({ response: req.body.parent_id });
                                }
                              }
                            );
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          res
                            .status(500)
                            .send('Internal Server Error.(parentIDSame)');
                        });
                    }
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(parentIDSame)');
          });

        //移動後は違うparent_id
      } else if (req.body.flg === 'parentIDDiffer') {
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
                //移動前の階層での変化。対象の要素より、順番が大きいもののorderを-１する
                'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
                [
                  req.body.old_parent_id,
                  req.body.old_order,
                  resultDecoded[0].id,
                ],
                (error, result_se) => {
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
                'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
                [
                  req.body.old_parent_id,
                  req.body.old_order,
                  resultDecoded[0].id,
                ],
                (error, result_se) => {
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
                'UPDATE it_memo SET parent_id = ? WHERE id = ?',
                [req.body.parent_id, req.body.id],
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({ response1: req.body.parent_id });
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(parentIDDiffer)');
          });
      } else if (req.body.flg === 'updatetime') {
        console.log(`[POST受信(updatetime)] time : ${req.body.time}`);
        pool.query(
          'UPDATE it_memo SET saved_time = ? WHERE id = ?;',
          [req.body.time, req.body.id],
          (error, result) => {
            res.send({ response: req.body.time });
          }
        );
      } else if (req.body.flg === 'name') {
        let promise = new Promise((resolve, reject) => {
          resolve();
        });
        promise
          .then(() => {
            return new Promise((resolve, reject) => {
              pool.query(
                'SELECT * FROM tab_hold WHERE id = ?',
                [req.body.id],
                (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    //タブを生成済みであれば(tab_holdに格納されていれば)
                    if (results.length != 0) {
                      //passカラムの値の変更前のタイトルを変更後に変換
                      let ans = results[0].pass.replace(
                        req.body.oldTitle,
                        req.body.title
                      );
                      let promise1 = new Promise((resolve, reject) => {
                        resolve();
                      });
                      promise1
                        .then(() => {
                          return new Promise((resolve, reject) => {
                            pool.query(
                              'UPDATE it_memo SET title = ?  WHERE id = ?',
                              [req.body.title, req.body.id],
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
                              'UPDATE tab_hold SET tabTitle = ?, pass = ? WHERE id = ?',
                              [req.body.title, ans, req.body.id],
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
                                if (error) {
                                  reject(error);
                                } else {
                                  res.send({
                                    response1: req.body.title,
                                    response2: result[0].pass,
                                    response3: result[0].focus,
                                  });
                                }
                              }
                            );
                          });
                        })
                        .catch((error) => {
                          console.error(error);
                          res.status(500).send('Internal Server Error.(name)');
                        });
                    } else {
                      pool.query(
                        'UPDATE it_memo SET title = ?  WHERE id = ?',
                        [req.body.title, req.body.id],
                        (error, result) => {
                          res.send({
                            response1: req.body.title,
                            response2: undefined,
                          });
                        }
                      );
                    }
                  }
                }
              );
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error.(name)');
          });
        //タブ押下時にメモの内容を表示する
      } else if (req.body.flg === 'updatePass') {
        pool.query(
          'UPDATE tab_hold SET pass = ? WHERE id = ?;',
          [req.body.pass, req.body.id],
          (error, result) => {
            res.send({ response: req.body.time });
          }
        );
      } else if (req.body.flg === 'info') {
        pool.query(
          'SELECT * FROM it_memo WHERE id = ?;',
          [req.body.id],
          (error, result) => {
            res.send({ response: result[0] });
          }
        );
      }
      //ログアウト時にcookie削除
    } else if (req.body.data === 'cookiedelete') {
      //cookie削除
      res.setHeader(
        'Set-Cookie',
        'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/'
      );
      res.end();
    } else if (req.body.data === 'getuser') {
      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM register_user;', (error, result) => {
              if (error) {
                reject(error);
              } else {
                const user = result.find(
                  (user) => user.UserName === req.body.name
                );
                if (!user) {
                  return res.send({
                    message: 'ユーザーが見つかりませんでした',
                  });
                }
                resolve(user);
              }
            });
          });
        })
        .then((user) => {
          return new Promise((resolve, reject) => {
            pool.query(
              //レコードをコピーして新しいレコードとして挿入
              'INSERT INTO it_memo (title, memo_text, Type, UserID) (SELECT title, memo_text, ?, ? FROM it_memo WHERE id = ?);',
              ['Share', user.id, req.body.id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ message: '共有しました' });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(getuser)');
        });
    } else if (req.body.data === 'humburger') {
      res.send({ msg: 'ハンバーガー押しましたね！？' });
      let promise = new Promise((resolve, reject) => {
        resolve();
      });

      promise
        .then(() => {
          throw Error('error');
        })
        .catch((error) => {
          console.Console(error);
          res.status(500).send('errorですよ〜');
        });
    } else {
      console.log('dataで何も受け取ってません');
    }
  });

module.exports = router;
