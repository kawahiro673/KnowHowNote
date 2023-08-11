const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'newFolder') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'INSERT into folder(folder_name, parent_id, UserID, folder_order) values(?, ?, ?, ?);',
            [
              req.body.folderName,
              req.body.parentId,
              resultDecoded[0].id,
              req.body.order,
            ],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({
                  msg: '成功しました',
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
  } else if (req.body.flg === 'parentIDSame') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'SELECT * FROM folder WHERE id = ?', //D&D前の情報保持のため
            [req.body.id],
            (error, folderResult) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  folderResult: folderResult,
                  resultDecoded: resultDecoded,
                });
              }
            }
          );
        });
      })
      .then(({ folderResult, resultDecoded }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE folder SET parent_id = ?, folder_order = ? WHERE id = ?',
            [req.body.parent_id, req.body.order, req.body.id],
            (error, nouse) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  folderResult: folderResult,
                  resultDecoded: resultDecoded,
                });
              }
            }
          );
        });
      })
      .then(({ folderResult, resultDecoded }) => {
        //D&Dしたフォルダのorderより大きいレコードにorderプラス１する。D&D前のorderとD&D後のorderが違う場合にプラス１
        if (req.body.order != folderResult[0].folder_order) {
          //下へD&D
          if (req.body.move === 'down') {
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
                      folderResult[0].folder_order,
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
                      folderResult[0].folder_order,
                      req.body.order,
                      resultDecoded[0].id,
                    ],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        res.send({
                          msg: '成功しました',
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
                      folderResult[0].folder_order,
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
                      folderResult[0].folder_order,
                      resultDecoded[0].id,
                    ],
                    (error, result) => {
                      if (error) {
                        reject(error);
                      } else {
                        res.send({
                          msg: '成功しました',
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
        } else {
          console.log('orderは変化なし');
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error.(newFolder)');
      });
  } //移動後は違うparent_id場合
  else if (req.body.flg === 'parentIDDiffer') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            //移動前の階層での変化。対象の要素より、順番が大きいもののorderを-１する
            'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
            [req.body.old_parent_id, req.body.old_order, resultDecoded[0].id],
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
            [req.body.old_parent_id, req.body.old_order, resultDecoded[0].id],
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
                res.send({ msg: '成功しました' });
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
        res.send({ msg: '成功しました' });
      }
    );
  } else if (req.body.flg === 'folderDel') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND (UserID = ?)',
            [req.body.parentId, req.body.order, resultDecoded[0].id],
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
            'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND (UserID = ?)',
            [req.body.parentId, req.body.order, resultDecoded[0].id],
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
            'DELETE from folder where id = ?',
            [req.body.id],
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
            'select * from it_memo WHERE UserID = ?;',
            [resultDecoded[0].id],
            (error, fileResults) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  fileResults: fileResults,
                  resultDecoded: resultDecoded,
                });
              }
            }
          );
        });
      })
      .then(({ fileResults, resultDecoded }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'select * from folder WHERE UserID = ?;',
            [resultDecoded[0].id],
            (error, folderResults) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  fileResults: fileResults,
                  folderResults: folderResults,
                });
              }
            }
          );
        });
      })
      .then(({ fileResults, folderResults }) => {
        return new Promise((resolve, reject) => {
          let tmpIdArray = [];
          let fileArray = []; //削除したフォルダの配下のファイルidを格納
          let folderArray = []; //削除したフォルダの配下のフォルダidを格納
          let tmp;

          tmpIdArray.push(req.body.id); //削除したフォルダidを格納

          while (tmpIdArray.length !== 0) {
            tmpIdArray.forEach((parentId) => {
              //配下のファイルを配列に格納
              fileResults.forEach((file) => {
                if (file.parent_id == parentId) {
                  //重複していなければ格納(格納されているのは削除したフォルダの子要素ファイルのid)
                  if (fileArray.indexOf(file.id) == -1) {
                    fileArray.push(file.id);
                  }
                }
              });
              //配下のフォルダを配列に格納
              folderResults.forEach((folder) => {
                if (folder.parent_id == parentId) {
                  //重複していなければ格納(格納されているのは削除したフォルダの子要素フォルダのid)
                  if (folderArray.indexOf(folder.id) == -1) {
                    folderArray.push(folder.id);
                  }
                  //削除したフォルダの配下のフォルダにも、子要素がある可能性があるため、繰り返し用の配列へ格納
                  if (tmpIdArray.indexOf(folder.id) == -1) {
                    tmpIdArray.push(folder.id);
                  }
                }
              });
              tmp = parentId;
            });
            //配下を全て確認したフォルダをtmpIdArrayから削除
            tmpIdArray.splice(tmpIdArray.indexOf(tmp), 1);
          }
          fileArray.forEach((file) => {
            pool.query(
              'DELETE from it_memo where id =?',
              [file],
              (error, result) => {}
            );
          });
          folderArray.forEach((folder) => {
            pool.query(
              'DELETE from folder where id =?',
              [folder],
              (error, result) => {}
            );
          });
          res.send({ response: fileArray });
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error.(folderDel)');
      });
  } else if (req.body.flg === 'collapsableALL') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE folder SET closed = "on" WHERE UserID = ? ;',
            [resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ msg: '成功しました' });
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
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE folder SET closed = "off" WHERE UserID = ?;',
            [resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ msg: '成功しました' });
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
    //開く→閉じる
    if (req.body.closedFlg == 1) {
      pool.query(
        'UPDATE folder SET closed = "on" WHERE id = ?;',
        [req.body.id],
        (error, result) => {
          res.send({ msg: '成功しました' });
        }
      );
      //開く→閉じる
    } else {
      pool.query(
        'UPDATE folder SET closed = "off" WHERE id = ?;',
        [req.body.id],
        (error, result) => {
          res.send({ msg: '成功しました' });
        }
      );
    }
  }
});

module.exports = router;
