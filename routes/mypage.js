const { getUserDataByToken } = require('./databaseQueries');

const router = require('express').Router();
const { append } = require('express/lib/response');
const pool = require('../db.js');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const { request } = require('express');
const res = require('express/lib/response');
const { reject } = require('bcrypt/promises');
const { off } = require('../db.js');
const rules = require('nodemon/lib/rules');
const Connection = require('mysql/lib/Connection');
const PoolCluster = require('mysql/lib/PoolCluster');
const nodemailer = require('nodemailer');

router
  .route('/:hashedId')
  .get((req, res) => {
    const encodedId = req.params.hashedId.replace(/\//g, '%2F');
    res.render('index.ejs', { hashedId: encodedId });
  })
  .post(async (req, res) => {
    if (req.body.flg === 'color') {
      pool.query(
        'UPDATE it_memo SET title_color=? WHERE id=?',
        [req.body.color, req.body.id],
        (error, result) => {
          res.send({ response: req.body.color });
        }
      );
    } else if (req.body.flg === 'addOrder') {
      getUserDataByToken(req)
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
    } else if (req.body.flg === 'folderChild') {
      let idArray = []; //最終的にmain.jsに返す値
      let parentIdArray = [];
      parentIdArray.push(req.body.id);
      getUserDataByToken(req)
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
     
    } 
       //フォルダの子ノートを全て取得する(passの更新に使用するため)
    // else if (req.body.flg === 'noteChild') {
    //   let idArray = []; //最終的にcodejsに返す値
    //   let parentIdArray = [];
    //   parentIdArray.push(req.body.id);
    //   getUserDataByToken(req)
    //     .then((resultDecoded) => {
    //       return new Promise((resolve, reject) => {
    //         pool.query(
    //           'SELECT * FROM folder WHERE UserID = ?;',
    //           [resultDecoded[0].id],
    //           (error, result_folder) => {
    //             if (error) {
    //               reject(error);
    //             } else {
    //               resolve({
    //                 result_folder,
    //                 resultDecoded,
    //               });
    //             }
    //           }
    //         );
    //       });
    //     })
    //     .then(({ result_folder, resultDecoded }) => {
    //       return new Promise((resolve, reject) => {
    //         pool.query(
    //           'SELECT * FROM it_memo WHERE UserID = ?;',
    //           [resultDecoded[0].id],
    //           (error, result_note) => {
    //             if (error) {
    //               reject(error);
    //             } else {
    //               while (parentIdArray.length !== 0) {
    //                 parentIdArray.forEach((parentId) => {
    //                   //まず配下のノート格納
    //                   result_note.forEach((note) => {
    //                     if (parentId == note.parent_id) {
    //                       //重複していないなら格納する
    //                       if (idArray.indexOf(note.id) == -1) {
    //                         idArray.push(note.id);
    //                       }
    //                     }
    //                   });
    //                   result_folder.forEach((folder) => {
    //                     if (parentId == folder.parent_id) {
    //                       //重複していないなら格納する
    //                       if (parentIdArray.indexOf(folder.id) == -1) {
    //                         parentIdArray.push(folder.id);
    //                       }
    //                     }
    //                   });
    //                   parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
    //                 });
    //               }
    //               resolve();
    //             }
    //           }
    //         );
    //       });
    //     })
    //     .then(() => {
    //       res.send({ response: idArray });
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       res.status(500).send('Internal Server Error.(noteChild)');
    //     });
    // }
    else {
      console.log('flgで何も受け取ってません');
    }
  });

module.exports = router;
