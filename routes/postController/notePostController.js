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
          [req.body.order, req.body.id],
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
                  resolve(result);
                }
              }
            );
          });
        })
        .then((result) => {
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
              [req.body.old_parent_id, req.body.old_order, resultDecoded[0].id],
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
              [req.body.old_parent_id, req.body.old_order, resultDecoded[0].id],
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
  }
});

module.exports = router;
