const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
   if (req.body.flg === 'Authentication_ID') {
      getUserDataByToken(req)
        .then((resultDecoded) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM register_user WHERE Authentication_ID = ?;',
              [req.body.Authentication_ID],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  const user = result.find(
                    (user) =>
                      user.Authentication_ID === req.body.Authentication_ID
                  );
                  if (!user) {
                    return res.send({ msg: 'NG' });
                  }
                  resolve({ user: user, resultDecoded: resultDecoded });
                }
              }
            );
          });
        })
        .then(({ user, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'SELECT * FROM friend_List WHERE user_name = ? AND UserID = ?;',
              [user.UserName, resultDecoded[0].id],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  if (result.length > 0) {
                    res.send({ userName: user.UserName, msg: 'already' });
                  } else {
                    resolve({ user: user, resultDecoded: resultDecoded });
                  }
                }
              }
            );
          });
        })
        .then(({ user, resultDecoded }) => {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT INTO friend_list (user_name, date, UserID, Changed_Name, User_Group) values(?, ?, ?, ?, ?);',
              [
                user.UserName,
                req.body.time,
                resultDecoded[0].id,
                user.UserName,
                'なし',
              ],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  res.send({ userName: user.UserName, msg: 'OK' });
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
