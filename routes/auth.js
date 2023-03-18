const router = require('express').Router();
const pool = require('../db');

router
  .route('/')
  .get((req, res) => {
    //指定したファイルを画面表示
    res.render('auth.ejs');
  })
  .post((req, res) => {
    if (req.body.data == 'info') {
      pool.query('SELECT * FROM register_user;', (error, result) => {
        console.log(result);

        res.send({ response: result });
      });
    }
  });

module.exports = router;
