const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'shareAdd') {
    let promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise
      .then(() => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE it_memo SET Type = ?, parent_id = ? WHERE id = ?;',
            ['ADD', 0, req.body.id],
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
            'SELECT * FROM it_memo WHERE id = ?;',
            [req.body.id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ fileResult: result[0] });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Internal Server Error.(shareAdd)');
      });
  } else if (req.body.flg === 'sharelist') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, rejct) => {
          pool.query(
            'select * from folder WHERE (UserID = ?) AND (Type = "Share") order by folder_order ASC ',
            [resultDecoded[0].id],
            (error, folderResults) => {
              if (error) {
                rejct(error);
              } else {
                resolve({
                  folderResults: folderResults,
                  resultDecoded: resultDecoded,
                });
              }
            }
          );
        });
      })
      .then(({ folderResults, resultDecoded }) => {
        return new Promise((resolve, rejct) => {
          pool.query(
            'select * from it_memo WHERE (UserID = ?) AND (Type = "Share") order by folder_order ASC',
            [resultDecoded[0].id],
            (error, fileResult) => {
              if (error) {
                reject(error);
              } else {
                res.send({
                  fileResult: fileResult,
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
  } else if (req.body.flg === 'shareNoteInfoGet') {
    pool.query(
      'SELECT * FROM it_memo WHERE id = ?',
      [req.body.id],
      (error, fileResult) => {
        res.send({
          fileResult: fileResult[0],
        });
      }
    );
  } else if (req.body.flg === 'getuser') {
    let nothingUser = [];
    let resultDecodedTmp;
    let recipientGroupsCopy = [...req.body.RecipientGroups];

    const token = req.cookies.token;
    const decoded = JWT.verify(token, 'SECRET_KEY');
    //配列かどうかをチェックし、そうでなければ単一の要素の配列に変換
    const RecipientIDs = Array.isArray(req.body.RecipientIDs)
      ? req.body.RecipientIDs
      : [req.body.RecipientIDs];
    //RecipientGroups の各要素に対して、非同期処理を順番に実行
    //reduce メソッドは、各要素に対して順番に処理を実行し、前の処理が完了した後に次の処理を実行
    RecipientIDs.reduce((promiseChain, RecipientID) => {
      return (
        promiseChain
          .then(() => {
            return new Promise((resolve, reject) => {
              pool.query('SELECT * FROM friend_list;', (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  const shareUser = result.find(
                    (user) => user.id === RecipientID
                  );
                  if (!shareUser) {
                    nothingUser.push(RecipientID);
                    resolve({ skip: true }); // ユーザーが見つからない場合、次のユーザーの処理に進む
                  } else {
                    pool.query(
                      'SELECT * FROM register_user WHERE UserName = ?;',
                      [shareUser.user_name],
                      (error, user) => {
                        resolve({ user });
                      }
                    );
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
                  'INSERT INTO it_memo (title, memo_text, Type, Message, UserID, Share_User, saved_time) (SELECT title, memo_text, ?, ?, ?, ?, ? FROM it_memo WHERE id = ?);',
                  [
                    'Share',
                    req.body.message,
                    user[0].id,
                    req.body.myName,
                    req.body.time,
                    req.body.id,
                  ],
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
                  'SELECT * FROM register_user WHERE UserName = ?;',
                  [decoded.userName],
                  (error, resultDecoded) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve({ resultDecoded, user });
                    }
                  }
                );
              });
            }
          })
          //共有履歴を作成
          .then(({ skip, resultDecoded, user }) => {
            //DBに格納されていないユーザーが参照してしまうと、余計な情報が格納されてしまうため(存在しないユーザーには共有されないようにしているため)
            if (skip) {
              return Promise.resolve({ skip: true });
            } else {
              return new Promise((resolve, reject) => {
                //共有した側の共有履歴
                pool.query(
                  'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                  [
                    user[0].UserName,
                    req.body.time,
                    req.body.title,
                    resultDecoded[0].id,
                    'True',
                  ],
                  (error, result) => {
                    //共有された側の共有履歴
                    pool.query(
                      'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                      [
                        resultDecoded[0].UserName,
                        req.body.time,
                        req.body.title,
                        user[0].id,
                        'False',
                      ],
                      (error, result) => {
                        if (error) {
                          reject(error);
                        } else {
                          resolve(resultDecoded);
                        }
                      }
                    );
                  }
                );
              });
            }
          })
      );
    }, Promise.resolve())
      .then(() => {
        let userIDArray = [];
        //配列かどうかをチェックし、そうでなければ単一の要素の配列に変換
        const RecipientGroups = Array.isArray(req.body.RecipientGroups)
          ? req.body.RecipientGroups
          : [req.body.RecipientGroups];

        //RecipientGroupsの各要素に対して、非同期処理を順番に実行
        //reduceメソッドは、各要素に対して順番に処理を実行し、前の処理が完了した後に次の処理を実行
        RecipientGroups.reduce((promiseChain, RecipientGroup) => {
          return promiseChain
            .then(() => {
              return new Promise((resolve, reject) => {
                pool.query(
                  'SELECT * FROM register_user WHERE UserName = ?;',
                  [decoded.userName],
                  (error, resultDecoded) => {
                    resultDecodedTmp = resultDecoded;
                    if (error) {
                      reject(error);
                    } else {
                      resolve({ resultDecoded });
                    }
                  }
                );
              });
            })
            .then(({ resultDecoded }) => {
              return new Promise((resolve, reject) => {
                pool.query(
                  'SELECT * FROM friend_list WHERE UserID = ?;',
                  [resultDecoded[0].id],
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      const shareGroup = result.find(
                        (user) => user.User_Group === RecipientGroup
                      );
                      const shareGroupArray = result.filter(
                        (user) => user.User_Group === RecipientGroup
                      );
                      const userNamesArray = shareGroupArray.map(
                        (row) => row.user_name
                      );
                      if (!shareGroup) {
                        nothingGroup.push(RecipientGroup);
                        resolve({ skip: true });
                      } else {
                        //it_memoに共有ノウハウとしてレコードを差し込むために、送信相手のUserIDを取得して配列(userIDArray)に格納。mapが終わるまで次の処理へは進まない
                        const promises = userNamesArray.map((userName) => {
                          return new Promise((resolve, reject) => {
                            pool.query(
                              'SELECT * FROM register_user WHERE UserName = ?;',
                              [userName],
                              (error, user) => {
                                if (error) {
                                  reject(error);
                                } else {
                                  userIDArray.push(user[0].id);
                                  //console.log(userIDArray);
                                  resolve();
                                }
                              }
                            );
                          });
                        });
                        Promise.all(promises)
                          .then(() => {
                            resolve();
                          })
                          .catch((error) => {
                            reject(error);
                          });
                      }
                    }
                  }
                );
              });
            })
            .then((result) => {
              //result が null の場合に skip をデフォルトで false として扱うため。skip が undefined となってしまうため実施
              const { skip = false } = result || {};
              if (skip) {
                return Promise.resolve({ skip: true });
              } else {
                console.log(resultDecodedTmp[0]);
                const promises = userIDArray.map((userID) => {
                  return new Promise((resolve, reject) => {
                    pool.query(
                      'INSERT INTO it_memo (title, memo_text, Type, Message, UserID, Share_User, saved_time) (SELECT title, memo_text, ?, ?, ?, ?, ? FROM it_memo WHERE id = ?);',
                      [
                        'Share',
                        req.body.message,
                        userID,
                        req.body.myName,
                        req.body.time,
                        req.body.id,
                      ],
                      (error, result) => {
                        //共有された側の共有履歴レコード
                        pool.query(
                          'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                          [
                            resultDecodedTmp[0].UserName,
                            req.body.time,
                            req.body.title,
                            userID,
                            'False',
                          ],
                          (error, result) => {
                            if (error) {
                              reject(error);
                            } else {
                              resolve();
                            }
                          }
                        );
                      }
                    );
                  });
                });
                return Promise.all(promises).then(() => {
                  //共有した側の共有履歴レコード
                  pool.query(
                    'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                    [
                      recipientGroupsCopy[0],
                      req.body.time,
                      req.body.title,
                      resultDecodedTmp[0].id,
                      'True',
                    ],
                    (error, result) => {
                      //共有するグループ名の配列であり、順次実行の際に配列の先頭のみを参照するため、先頭のみ順番に削除している
                      recipientGroupsCopy.shift();
                    }
                  );
                  userIDArray = []; // 次のグループのUserIDを格納するため初期化
                });
              }
            });
        }, Promise.resolve()).then(() => {
          res.send({ message: '共有しました', nothingUser });
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  } else if (req.body.flg === 'share-delete') {
    pool.query(
      'DELETE FROM it_memo WHERE id = ?;',
      [req.body.id],
      (error, result) => {
        res.send({ msg: '成功' });
      }
    );
  }
});

module.exports = router;
