const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'friend-list-get') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'SELECT * FROM friend_list WHERE UserID = ?;',
            [resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ friend: result });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  } else if (req.body.flg === 'friend-list-delete') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'DELETE from friend_list where user_name = ? AND  UserID = ?;',
            [req.body.name, resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ msg: '成功' });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  } else if (req.body.flg === 'friend-list-name-change') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE friend_list SET Changed_Name = ? WHERE id = ?;',
            [req.body.name, req.body.id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                res.send({ msg: '成功' });
              }
            }
          );
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  }
});

module.exports = router;
