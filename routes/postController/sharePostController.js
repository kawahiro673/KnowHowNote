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
    const token = req.cookies.token;
    const decoded = JWT.verify(token, 'SECRET_KEY');
    let promise = new Promise((resolve, reject) => {
      resolve();
    });

    promise
      .then(() => {
        return new Promise((resolve, rejct) => {
          pool.query(
            'SELECT * FROM register_user WHERE UserName = ?;',
            [decoded.userName],
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
    const token = req.cookies.token;
    const decoded = JWT.verify(token, 'SECRET_KEY');
    const userNames = Array.isArray(req.body.name)
      ? req.body.name
      : [req.body.name];

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
                    resolve({ skip: true }); // ユーザーが見つからない場合、次のユーザーの処理に進む
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
                  'INSERT INTO it_memo (title, memo_text, Type, Message, UserID, Share_User, saved_time) (SELECT title, memo_text, ?, ?, ?, ?, ? FROM it_memo WHERE id = ?);',
                  [
                    'Share',
                    req.body.message,
                    user.id,
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
          .then(({ skip, resultDecoded, user }) => {
            //DBに格納されていないユーザーが参照してしまうと、余計な情報が格納されてしまうため(存在しないユーザーには共有されないようにしているため)
            if (skip) {
              return Promise.resolve({ skip: true });
            } else {
              return new Promise((resolve, reject) => {
                pool.query(
                  'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                  [
                    name,
                    req.body.time,
                    req.body.title,
                    resultDecoded[0].id,
                    'True',
                  ],
                  (error, result) => {
                    pool.query(
                      'INSERT INTO share_user (UserName, date, ShareNoteTitle, UserID, Share_ToDo_Flg) values(?, ?, ?, ?, ?);',
                      [
                        resultDecoded[0].UserName,
                        req.body.time,
                        req.body.title,
                        user.id,
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
            }
          });
      }, Promise.resolve())
      .then(() => {
        res.send({ message: '共有しました', nothingUser });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  }
});

module.exports = router;
