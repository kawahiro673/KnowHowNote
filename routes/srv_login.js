const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.render('login.ejs');
});

module.exports = router;
