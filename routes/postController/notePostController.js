const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'newNote') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'INSERT into it_memo(title, parent_id, saved_time, Type, UserID,  folder_order) values(?, ?, ?, ?, ?, ?); ',
            [
              req.body.title,
              req.body.parentId,
              req.body.time,
              'Original',
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
        res.status(500).send('Internal Server Error.(newNote)');
      });
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
    //ファイルを削除&前後のorder調整と、タブ削除＆タブorder調整
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE folder SET folder_order = folder_order - 1 where parent_id = ? AND folder_order > ? AND UserID = ?',
            [req.body.parentId, req.body.fileOrder, resultDecoded[0].id],
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
            [req.body.parentId, req.body.fileOrder, resultDecoded[0].id],
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
            'DELETE from it_memo where id = ?',
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
            'DELETE from tab_hold where id = ?',
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
            'UPDATE tab_hold SET tabOrder = tabOrder - 1 WHERE tabOrder > ? AND (UserID = ?); ',
            [req.body.tabOrder, resultDecoded[0].id],
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
        res.status(500).send('Internal Server Error.(delete)');
      });
  } else if (req.body.flg === 'parentIDSame') {
    //parentIdは変化しないパターン(同じ階層)
    getUserDataByToken(req)
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
                  console.log('order変化なし');
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
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            //移動前要素群。対象の要素より順番が大きいもののorderを-１する(folder)
            'UPDATE folder SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
            [req.body.oldParentID, req.body.oldOrder, resultDecoded[0].id],
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
            //移動前要素群。対象の要素より順番が大きいもののorderを-１する(it_memo)
            'UPDATE it_memo SET folder_order = folder_order -1 where (parent_id = ?) AND (folder_order > ?) AND (UserID = ?)',
            [req.body.oldParentID, req.body.oldOrder, resultDecoded[0].id],
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
            //移動後要素群。対象の要素以上に順番が大きいもののorderを+１する(folder)
            'UPDATE folder SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?) AND (UserID = ?)',
            [req.body.newParentID, req.body.newOrder, resultDecoded[0].id],
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
            //移動後要素群。対象の要素以上に順番が大きいもののorderを+１する(it_memo)
            'UPDATE it_memo SET folder_order = folder_order +1 where (parent_id = ?) AND (folder_order >= ?) AND (UserID = ?)',
            [req.body.newParentID, req.body.newOrder, resultDecoded[0].id],
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
            [req.body.newParentID, req.body.id],
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
            'UPDATE it_memo SET folder_order =? WHERE id = ?',
            [req.body.newOrder, req.body.id],
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
                          'UPDATE it_memo SET title = ?,  saved_time = ?  WHERE id = ?',
                          [req.body.title, req.body.time, req.body.id],
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
                        tabResult: null,
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
  } else if (req.body.flg === 'fileColorChange') {
    pool.query(
      'UPDATE it_memo SET title_color = ?  WHERE id = ?',
      [req.body.color, req.body.id],
      (error, result) => {
        res.send({
          msg: '成功しました',
        });
      }
    );
  } else if (req.body.flg === 'info_name') {
    console.log(req.body.name);
    pool.query(
      'SELECT * FROM register_user WHERE UserName = ?;',
      [req.body.name],
      (error, result) => {
        res.send({ fileResult: result[0] });
      }
    );
  }
});

module.exports = router;
