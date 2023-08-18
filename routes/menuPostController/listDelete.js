const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'Delete-ALL') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'DELETE from folder WHERE UserID = ?',
            [resultDecoded[0].id],
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
            'DELETE from it_memo WHERE UserID = ?',
            [resultDecoded[0].id],
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
            'DELETE from tab_hold WHERE UserID = ?',
            [resultDecoded[0].id],
            (error, result) => {
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
        res.status(500).send('Internal Server Error.(sharelist)');
      });
  }
});

module.exports = router;
