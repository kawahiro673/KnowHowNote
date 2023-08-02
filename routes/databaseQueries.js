const pool = require('../db.js');
const JWT = require('jsonwebtoken');

function getUserDataByToken(req) {
  const token = req.cookies.token;
  const decoded = JWT.verify(token, 'SECRET_KEY');
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM register_user WHERE UserName = ?;',
      [decoded.userName],
      (error, resultDecoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultDecoded);
        }
      }
    );
  });
}

module.exports = { getUserDataByToken };
