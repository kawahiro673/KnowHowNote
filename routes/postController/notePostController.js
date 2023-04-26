const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.data === 'note') {
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
                'INSERT into it_memo(title, parent_id, saved_time, Type, UserID) values(?, ?, ?, ?, ?); ', // 挿入
                [
                  req.body.title,
                  req.body.parentId,
                  req.body.time,
                  'Original',
                  resultDecoded[0].id,
                ], //この値が？に入る
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
                //追加したばかりのノートはidが一番大きいため、上を取得
                'SELECT * FROM  it_memo ORDER BY id DESC;',
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    res.send({
                      fileResult: result[0],
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
          [req.body.order, req.body.id],
          (error, result) => {
            res.send({
              msg: '成功しました',
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
              'select * from it_memo where id = ?;',
              [req.body.id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        })
        .then((result) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE tab_hold SET tabTitle = ? WHERE id = ?;',
              [req.body.titleContent, req.body.id],
              (error, nouse) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({
                    fileResult: result[0],
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
              'UPDATE it_memo SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND UserID = ?',
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
              'DELETE from it_memo where id = ?',
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
            pool.query('select * from it_memo', (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query('select * from folder', (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({
                  msg: '成功しました',
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
              (error, fileResult) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({
                    fileResult: fileResult,
                    resultDecoded: resultDecoded,
                  });
                }
              }
            );
          });
        })
        .then(({ fileResult, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE it_memo SET parent_id = ?, folder_order = ?  WHERE id = ?',
              [req.body.parent_id, req.body.order, req.body.id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  //D＆Dで移動した時
                  if (req.body.order != fileResult[0].folder_order) {
                    //下へD＆D
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
                                fileResult[0].folder_order,
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
                                fileResult[0].folder_order,
                                req.body.order,
                                resultDecoded[0].id,
                              ],
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
                          res
                            .status(500)
                            .send('Internal Server Error.(parentIDSame)');
                        });
                    } else {
                      console.log('上へのやつ');
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
                                fileResult[0].folder_order,
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
                                fileResult[0].folder_order,
                                resultDecoded[0].id,
                              ],
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
                          res
                            .status(500)
                            .send('Internal Server Error.(parentIDSame)');
                        });
                    }
                  } else {
                    console.log('orderは変化なし');
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
              'UPDATE it_memo SET parent_id = ? WHERE id = ?',
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
    } else if (req.body.flg === 'updatetime') {
      console.log(`[POST受信(updatetime)] time : ${req.body.time}`);
      pool.query(
        'UPDATE it_memo SET saved_time = ? WHERE id = ?;',
        [req.body.time, req.body.id],
        (error, result) => {
          res.send({ msg: '成功しました' });
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
              (error, tabResult) => {
                if (error) {
                  reject(error);
                } else {
                  //タブを生成済みであれば(tab_holdに格納されていれば)
                  if (tabResult.length != 0) {
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
                            'UPDATE tab_hold SET tabTitle = ? WHERE id = ?',
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
                            'SELECT * FROM tab_hold WHERE id = ?',
                            [req.body.id],
                            (error, result) => {
                              if (error) {
                                reject(error);
                              } else {
                                res.send({
                                  tabResult: result[0],
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
                          tabResult: undefined,
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
    } else if (req.body.flg === 'info') {
      pool.query(
        'SELECT * FROM it_memo WHERE id = ?;',
        [req.body.id],
        (error, result) => {
          res.send({ fileResult: result[0] });
        }
      );
    }
  }
});

module.exports = router;
