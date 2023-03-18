const pool = require('../db');

const router = require('express').Router();

router
  .route('/')
  .get((req, res) => {
    //指定したファイルを画面表示
    res.render('auth.ejs');
  })
  .post((req, res) => {
    if (req.body.data == 'info') {
      pool.query('SELECT * FORM register_user;', (error, result) => {
        console.log(result);

        res.send({ response: 'OK!' });
      });
    }
  });

module.exports = router;
