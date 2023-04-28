const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'newFolder') {
    if (req.body.pattern === 'new') {
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
              //新規作成後にフォルダーidを取得するためのクエリ
              'select * from folder order by id desc; ',
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({
                    folderResults: result[0],
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
            msg: '成功しました',
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
          pool.query('select * from it_memo;', (error, fileResults) => {
            if (error) {
              reject(error);
            } else {
              resolve(fileResults);
            }
          });
        });
      })
      .then((fileResults) => {
        return new Promise((resolve, reject) => {
          pool.query('select * from folder;', (error, folderResults) => {
            if (error) {
              reject(error);
            } else {
              res.send({
                response: req.body.id,
                fileResults: fileResults,
                folderResults: folderResults,
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
