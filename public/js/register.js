const userName = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cfPassword = document.getElementById('confirmedPassword');

document
  .getElementById('register')
  .addEventListener('click', registerButtonClick);

function registerButtonClick() {
  console.log('クリックしました');
  $.ajax({
    url: '/auth/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'info',
    }),
    success: function (res) {
      //未入力確認
      if (
        userName.value === '' ||
        email.value === '' ||
        password.value === '' ||
        cfPassword.value === ''
      ) {
        alert('入力されていない情報があります');
        return false;
      }
      //ユーザー名かぶりチェック
      const user = res.response.find(
        (user) => user.UserName === userName.value
      );
      if (user) {
        alert('そのユーザーは登録できません');
        return false;
      }
      //emailバリデーションチェック
      if (!email.value.match(/.+@.+\..+/)) {
        alert('正しいメールアドレスを入力してください');
        return false;
      }
      //確認用パスワード入力チェック
      if (password.value !== cfPassword.value) {
        alert('パスワードの入力に誤りがあります');
        return false;
      }
      //既に登録されているemailがあれば「登録済み」とする
      const mail = res.response.find((user) => user.Email === email.value);
      if (mail) {
        alert('既に登録されてあるメールアドレスです');
        return false;
      }
      //console.log('登録が完了しました');
      console.log(document.cookie);
      $.ajax({
        url: '/auth/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'cipher',
          username: userName.value,
          email: email.value,
          password: password.value,
        }),
        success: function (res) {
          //console.log(res.token);
        },
      });
    },
  });
}
