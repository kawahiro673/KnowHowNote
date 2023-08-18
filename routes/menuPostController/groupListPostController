const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'group_add') {
      getUserDataByToken(req)
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT INTO group_list (User_Group, UserID) values(?, ?);',
              [req.body.groupName, resultDecoded[0].id],
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
    } else if (req.body.flg === 'group_get') {
      getUserDataByToken(req)
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM group_list WHERE UserID = ?;',
              [resultDecoded[0].id],
              (error, result) => {
                res.send({ groupResults: result });
              }
            );
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: error.message, nothing });
        });
    } else if (req.body.flg === 'group_update') {
      pool.query(
        'UPDATE friend_list SET User_Group = ? WHERE id = ?;',
        [req.body.group, req.body.id],
        (error, result) => {
          res.send({ msg: '成功' });
        }
      );
    } else if (req.body.flg === 'group_delete') {
      getUserDataByToken(req)
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'DELETE FROM group_list WHERE UserID = ? AND User_Group = ?;',
              [resultDecoded[0].id, req.body.group],
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
              'UPDATE friend_list SET User_Group = ? WHERE UserID = ? AND User_Group = ?;',
              ['なし', resultDecoded[0].id, req.body.group],
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
    } else if (req.body.flg === 'group_info') {
      getUserDataByToken(req)
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM friend_list WHERE UserID = ? AND User_Group = ?;',
              [resultDecoded[0].id, req.body.group],
              (error, friendResult) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ friendResult: friendResult });
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
