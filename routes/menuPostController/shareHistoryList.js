const { getUserDataByToken } = require('../databaseQueries');

const router = require('express').Router();
const pool = require('../../db.js');
const JWT = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');

router.post('/', (req, res) => {
  if (req.body.flg === 'ShareList') {
      getUserDataByToken(req).then((resultDecoded) => {
        return new Promise((resolve, reject) => {
          pool.query(
            'SELECT id FROM share_user WHERE UserID = ? ORDER BY id DESC LIMIT 100;',
            [resultDecoded[0].id],
            (error, rows) => {
              if (error) {
                reject(error);
              } else {
                // 最新の100行のIDを取得
                const idsToKeep = rows.map((row) => row.id);
                if (idsToKeep.length > 0) {
                  // 最新の100行以外のレコードを削除
                  pool.query(
                    'DELETE FROM share_user WHERE UserID = ? AND id NOT IN (?);',
                    [resultDecoded[0].id, idsToKeep],
                    (error, deleteResult) => {
                      if (error) {
                        reject(error);
                      } else {
                        pool.query(
                          'SELECT * FROM share_user WHERE UserID = ? ORDER BY id DESC;',
                          [resultDecoded[0].id],
                          (error, selectResult) => {
                            if (error) {
                              reject(error);
                            } else {
                              res.send({ shareResult: selectResult });
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  res.send({ shareResult: null });
                }
              }
            }
          );
        });
      });
    }
});

module.exports = router;
