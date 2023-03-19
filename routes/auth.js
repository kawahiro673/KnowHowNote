const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

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
      console.log(req.body.password);
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log(hashedPassword);
      pool.query('SELECT * FROM register_user;', (error, result) => {
        res.send({ response: hashedPassword });
      });
    }
  });

module.exports = router;
