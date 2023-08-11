const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'updateFocus') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE tab_hold SET focus = ? where id = ?',
            [1, req.body.id],
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
            'UPDATE tab_hold SET focus = ? where id != ? AND (UserID = ?)',
            [0, req.body.id, resultDecoded[0].id],
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
        res.status(500).send('Internal Server Error.(updateFocus)');
      });
  } else if (req.body.flg === 'tabDesc') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'SELECT * FROM tab_hold WHERE UserID = ? ORDER BY tabOrder;',
            [resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                //res.send({ tabResult: result });
                resolve({ resultDecoded: resultDecoded, result: result });
              }
            }
          );
        });
      }) //リロードの際にフォーカスの当たっているタブを取得するため
      .then(({ resultDecoded, result }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'select * from tab_hold where focus = 1 AND (UserID = ?);',
            [resultDecoded[0].id],
            (error, focusResult) => {
              if (error) {
                reject(error);
              } else {
                res.send({ tabResult: result, focusResult: focusResult[0] });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error.(tabDesc)');
      });
  } else if (req.body.flg === 'tabDelete') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'SELECT * FROM tab_hold WHERE id = ?',
            [req.body.id],
            (error, tabResult) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  resultDecoded: resultDecoded,
                  tabResult: tabResult,
                });
              }
            }
          );
        });
      })
      .then(({ resultDecoded, tabResult }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'DELETE from tab_hold where id = ?',
            [req.body.id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  resultDecoded: resultDecoded,
                  tabResult: tabResult,
                });
              }
            }
          );
        });
      })
      .then(({ resultDecoded, tabResult }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE tab_hold SET tabOrder = tabOrder - 1 WHERE tabOrder > ? AND (UserID = ?); ',
            [req.body.order, resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ tabResult: tabResult[0] });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error.(tabDel)');
      });
  } else if (req.body.flg === 'tabAdd') {
    //タブが生成されていなければ実施(INSERT処理のため)
    getUserDataByToken(req)
      .then((resultDecoded) => {
        if (!req.body.isSomething) {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT into tab_hold(id, tabTitle, UserID) values(?, ?, ?);',
              [req.body.id, req.body.title, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(resultDecoded);
                }
              }
            );
          });
        } else {
          return resultDecoded; // 何もしない場合はそのままresultDecodedを返す
        }
      })
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE tab_hold SET tabOrder = ?, focus = 1 where id = ?',
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
            'UPDATE tab_hold SET focus = 0 where id != ? AND (UserID = ?)',
            [req.body.id, resultDecoded[0].id],
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
        res.status(500).send('Internal Server Error.(tabAdd)');
      });
  } else if (req.body.flg === 'labelColorUpdate') {
    pool.query(
      'UPDATE it_memo SET tab_color = ? WHERE id = ? ',
      [req.body.color, req.body.id],
      (error, result) => {
        res.send({ msg: '成功しました' });
      }
    );
  } else if (req.body.flg === 'labelColorGet') {
    pool.query(
      'SELECT * FROM it_memo WHERE id = ?',
      [req.body.id],
      (error, result) => {
        res.send({ labelColor: result[0].tab_color });
      }
    );
  }
});

module.exports = router;
