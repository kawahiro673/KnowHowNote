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
            'SELECT * FROM register_user WHERE Email = ?;',
            [decoded.email],
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
  }
});

module.exports = router;
