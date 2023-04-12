exports.createPost = (req, res) => {
  if (req.body.data == 'color') {
    pool.query(
      'UPDATE it_memo SET title_color=? WHERE id=?',
      [req.body.color, req.body.id],
      (error, results) => {
        res.send({ response: req.body.color });
      }
    );
  }
};
