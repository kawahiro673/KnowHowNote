const router = require('express').Router();
const pool = require('../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post((req, res) => {
  if (req.body.data === 'tab') {
    if (req.body.flg === 'clickTab') {
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
              'UPDATE tab_hold SET tabOrder = ?,focus = 1 where id = ?',
              [req.body.order, req.body.id],
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
              'UPDATE tab_hold SET focus = 0 where id != ? AND (UserID = ?)',
              [req.body.id, resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ response: results });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(clickTab)');
        });
    } else if (req.body.flg === 'updateFocus') {
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
                  reject();
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
              'UPDATE tab_hold SET focus = ?, pass = ? where id = ?',
              [1, req.body.pass, req.body.id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve({ result: result, resultDecoded: resultDecoded });
                }
              }
            );
          });
        })
        .then(({ result, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE tab_hold SET focus = ? where id != ? AND (UserID = ?)',
              [0, req.body.id, resultDecoded[0].id],
              (error, results) => {
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
          res.status(500).send('Internal Server Error.(addOrder)');
        });
    } else if (req.body.flg === 'updateOrder') {
      pool.query(
        'UPDATE tab_hold SET tabOrder = ? where id = ?',
        [req.body.order, req.body.id],
        (error, results) => {
          res.send({ response: results });
        }
      );
    } else if (req.body.flg === 'tabDesc') {
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
              'SELECT * FROM tab_hold WHERE UserID = ? ORDER BY tabOrder;',
              [resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ response: results });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(tabDesc)');
        });
    } else if (req.body.flg === 'info') {
      pool.query('SELECT * FROM tab_hold;', (error, result) => {
        res.send({ response: result });
      });
    } else if (req.body.flg === 'focusTab') {
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
              'select * from tab_hold where focus = 1 AND (UserID = ?);',
              [resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ response: result[0] });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(focusTab)');
        });
    } else if (req.body.flg === 'tabDel') {
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
              'SELECT * FROM it_memo WHERE id = ?',
              [req.body.id],
              (error, resultFocus) => {
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
                  resolve({ result: result, resultDecoded: resultDecoded });
                }
              }
            );
          });
        })
        .then(({ result, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'UPDATE tab_hold SET tabOrder = tabOrder - 1 WHERE tabOrder > ? AND (UserID = ?); ',
              [req.body.order, resultDecoded[0].id],
              (error, results) => {
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
          res.status(500).send('Internal Server Error.(tabDel)');
        });
    } else if (req.body.flg === 'tabAdd') {
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
              'INSERT into tab_hold(id, tabTitle, pass, UserID) values(?, ?, ?, ?);',
              [req.body.id, req.body.title, req.body.pass, resultDecoded[0].id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ response: results });
                }
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Internal Server Error.(tabAdd)');
        });
    }
  }
});

module.exports = router;
