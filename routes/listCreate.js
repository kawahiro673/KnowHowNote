const { getUserDataByToken } = require('./databaseQueries');

const router = require('express').Router();
const pool = require('../db.js');

async function getUserDataAndQueries(req) {
  try {
    const resultDecoded = await getUserDataByToken(req);

    const query1 =
      'SELECT * FROM folder WHERE (Type IS NULL) AND (UserID = ?) ORDER BY folder_order ASC';
    const query2 =
      'SELECT * FROM it_memo WHERE (Type != "Share") AND (UserID = ?) ORDER BY folder_order ASC';

    const [results1, results2] = await Promise.all([
      executeQuery(query1, [resultDecoded[0].id]),
      executeQuery(query2, [resultDecoded[0].id]),
    ]);

    return { resultDecoded, results1, results2 };
  } catch (error) {
    throw error;
  }
}

async function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// メインのルートハンドラ
router.post('/', async (req, res) => {
  try {
    const { resultDecoded, results1, results2 } = await getUserDataAndQueries(
      req
    );
    res.send({
      response: results1,
      response2: results2,
      userName: resultDecoded[0].UserName,
      id: resultDecoded[0].id,
      user: resultDecoded[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error.(list)');
  }
});

module.exports = router;
