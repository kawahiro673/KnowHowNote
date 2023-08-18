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
  } else if (req.body.flg === 'AuthenticationIDUpdte') {
    getUserDataByToken(req)
      .then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          let authenticationID = generateRandomID();
          //かなり確率として低いが、利用者IDがかぶる可能性もあるため、確認している
          //DBをすべて参照するより重複しているかを確認した方が早いため下記で確認
          function checkAndInsert() {
            pool.query(
              'SELECT COUNT(*) AS count FROM register_user WHERE Authentication_ID = ?',
              [authenticationID],
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  const count = result[0].count;
                  if (count === 0) {
                    // 重複しない authenticationID が見つかった場合
                    resolve({
                      resultDecoded: resultDecoded,
                      authenticationID: authenticationID,
                    });
                  } else {
                    // 重複する場合は新しい authenticationID を生成して再度チェック
                    authenticationID = generateRandomID();
                    checkAndInsert();
                  }
                }
              }
            );
          }
          // 初回の重複チェックを実行
          checkAndInsert();
        });
      })
      .then(({ resultDecoded, authenticationID }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'UPDATE register_user SET Authentication_ID = ? WHERE id = ?;',
            [authenticationID, resultDecoded[0].id],
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(authenticationID);
              }
            }
          );
        });
      })
      .then((authenticationID) => {
        res.send({ authenticationID });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: error.message, nothing });
      });
  }
});

module.exports = router;

function generateRandomID() {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let userID = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userID += characters.charAt(randomIndex);
    if ((i + 1) % 4 === 0 && i !== 15) {
      userID += '-';
    }
  }
  return userID;
}
