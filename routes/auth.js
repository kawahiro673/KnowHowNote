const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');
const nodemailer = require('nodemailer');

//認証情報
const auth = {
  type: 'OAuth2',
  user: 'akanuma.9099@gmail.com',
  clientId:
    '755195789659-0lt6su9q88eq0585igj83b4m5ont4bbi.apps.googleusercontent.com',
  clientSecret: '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',
  refreshToken:
    '1//04_aWdS9pheLjCgYIARAAGAQSNwF-L9IrHvN4nWm4Th8Q2Bub24PndrddgDhDZZGm3THAbFv22Mt2bRwjxf9eUDjyhvYDNU52pDw',
};
const transport = {
  service: 'gmail',
  auth,
};
const transporter = nodemailer.createTransport(transport);

router
  .route('/')
  .get((req, res) => {
    //指定したファイルを画面表示
    res.render('auth.ejs');
  })
  .post(async (req, res) => {
    if (req.body.flg === 'info') {
      pool.query('SELECT * FROM register_user;', (error, result) => {
        res.send({ response: result });
      });
    } else if (req.body.flg === 'cipher') {
      //bcryptモジュールを使用して暗号化(ソルト)
      let userName = req.body.username;

      let hashedPassword = await bcrypt.hash(req.body.password, 10);

      const randomID = generateRandomID();

      let promise = new Promise((resolve, reject) => {
        resolve();
      });
      promise
        .then(() => {
          return new Promise((resolve, reject) => {
            pool.query(
              'INSERT INTO register_user (UserName, HashedPassword, Email, CreationDay, Authentication_ID, LoginDate) VALUES(?, ?, ?, ?, ?, ?);',
              [
                userName,
                hashedPassword,
                req.body.email,
                req.body.time,
                randomID,
                req.body.time,
              ],
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
        //登録ユーザーをidの降順にすることによって、追加したばかりのユーザーを取得している
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
              [fileResult[0].id, 1, 1, '新しいノウハウ１', userResult[0].id, '#0000FF'],
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
            const url = `https://nodejs-itnote-app.herokuapp.com/mypage/${encodedId}`;

            const options = {
              httpOnly: true,
              maxAge: 1000 * 60 * 360,
            };

            if(req.body.email){
             const mailOptions = {
                  from: auth.user,
                  to: req.body.email,
                  subject: '【Know How Note】メールアドレス設定',
                  text: `${userName}様\n\n日頃より「Know How Note」をご利用くださり誠にありがとうございます。\nあなたのアカウントについて、こちらのアドレスを承りました。\n\n※当メールは送信専用メールアドレスから配信されています。このままご返信いただいてもお答えできませんのでご了承ください。\n\n※当メールに心当たりの無い場合は、誠に恐れ入りますが破棄して頂けますよう、よろしくお願いいたします。\n`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.log('Error:', error);
                    res.status(500).send('Error sending email');
                  } else {
                    console.log('Email sent:', info.response);
                  }
                });
            }
            
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
          res.status(500).send('Internal Server Error.(Register user)');
        });
    }
  });

module.exports = router;

//数字とアルファベットの文字セットからランダムな文字を選択し、4文字ずつ区切った形式で16桁のユーザーIDを生成
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
