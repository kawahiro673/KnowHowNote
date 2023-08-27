const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', async (req, res) => {
  let userName = req.body.name;
  let promise = new Promise((resolve, reject) => {
    resolve();
  });
  promise
    .then(() => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO register_user (UserName, Authentication_ID, CreationDay, LoginDate) VALUES(?, ?, ?, ?);',
          [req.body.name, '****-****-****-****', req.body.time, req.body.time],
          (error, result) => {
            if (error) {
              reject();
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
          'SELECT * FROM register_user ORDER BY id DESC;',
          (error, userResult) => {
            if (error) {
              reject();
            } else {
              resolve(userResult);
            }
          }
        );
      });
    })
    .then((userResult) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO folder (folder_name, parent_id, folder_order, closed, UserID) VALUES(?, ?, ?, ?, ?);',
          ['新しいフォルダ', 0, 1, 'off', userResult[0].id],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve(userResult);
            }
          }
        );
      });
    })
    .then((userResult) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'SELECT * FROM folder WHERE UserID = ?;',
          [userResult[0].id],
          (error, folderResult) => {
            if (error) {
              reject();
            } else {
              resolve({
                folderResult: folderResult,
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ folderResult, userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO it_memo (title, memo_text, saved_time, parent_id, folder_order, Type, UserID) VALUES(?,?,?,?,?,?,?);',
          [
            '新しいノウハウ１',
            'こちらはサンプルになります',
            req.body.time,
            0,
            2,
            'Original',
            userResult[0].id,
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                folderResult: folderResult,
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ folderResult, userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'SELECT * FROM it_memo WHERE UserID = ? ORDER BY id DESC ;',
          [userResult[0].id],
          (error, fileResult) => {
            if (error) {
              reject();
            } else {
              resolve({
                folderResult: folderResult,
                userResult: userResult,
                fileResult: fileResult,
              });
            }
          }
        );
      });
    })
    .then(({ folderResult, userResult, fileResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO tab_hold (id, focus, tabOrder, tabTitle, UserID, label_color) VALUES(?,?,?,?,?,?);',
          [
            fileResult[0].id,
            1,
            1,
            '新しいノウハウ１',
            userResult[0].id,
            '#0000FF',
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                folderResult: folderResult,
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ folderResult, userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO it_memo (title, memo_text, saved_time, parent_id, folder_order, Type, UserID) VALUES(?,?,?,?,?,?,?);',
          [
            '新しいノウハウ２',
            'こちらはサンプルになります',
            req.body.time,
            folderResult[0].id,
            1,
            'Original',
            userResult[0].id,
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO friend_list (user_name, UserID, date, Changed_Name, User_Group) VALUES(?,?,?,?,?);',
          [
            'GestUser_1',
            userResult[0].id,
            '2023年01月01日 00:00',
            'GestUser_1',
            'グループ１',
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO friend_list (user_name, UserID, date, Changed_Name, User_Group) VALUES(?,?,?,?,?);',
          [
            'GestUser_2',
            userResult[0].id,
            '2023年01月01日 00:00',
            'GestUser_2',
            'グループ１',
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO friend_list (user_name, UserID, date, Changed_Name, User_Group) VALUES(?,?,?,?,?);',
          [
            'GestUser_3',
            userResult[0].id,
            '2023年01月01日 00:00',
            'GestUser_3',
            'グループ2',
          ],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO group_list (User_Group, UserID) VALUES(?,?);',
          ['グループ１', userResult[0].id],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(({ userResult }) => {
      return new Promise((resolve, reject) => {
        pool.query(
          'INSERT INTO group_list (User_Group, UserID) VALUES(?,?);',
          ['グループ２', userResult[0].id],
          (error, result) => {
            if (error) {
              reject();
            } else {
              resolve({
                userResult: userResult,
              });
            }
          }
        );
      });
    })
    .then(async ({ userResult }) => {
      try {
        const token = await JWT.sign(
          {
            userName,
          },
          'SECRET_KEY'
        );
        const hashedId = bcrypt.hashSync(userResult[0].id.toString(), 10);
        const encodedId = encodeURIComponent(hashedId);
        const url = `https://knowhownote-106672fa32dd.herokuapp.com/mypage/${encodedId}`;

        const options = {
          httpOnly: true,
          maxAge: 1000 * 60 * 360,
        };

        res.cookie('token', token, options);
        res.cookie('hashedId', encodedId, options);

        return res.send({ message: 'ok', url: url });
      } catch (error) {
        // エラーハンドリング
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    })
    .catch((error) => {
      console.error(error);
      // res.status(500).send('Internal Server Error.(Register user)');
    });
});

module.exports = router;
