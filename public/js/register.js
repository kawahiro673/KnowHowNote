const userName = document.getElementById('username');
const email_auth = document.getElementById('email_auth');
const password_auth = document.getElementById('password_auth');
const cfPassword = document.getElementById('confirmedPassword');

document
  .getElementById('registerbtn')
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
        email_auth.value === '' ||
        password_auth.value === '' ||
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
      if (!email_auth.value.match(/.+@.+\..+/)) {
        alert('正しいメールアドレスを入力してください');
        return false;
      }
      //確認用パスワード入力チェック
      if (password_auth.value !== cfPassword.value) {
        alert('パスワードの入力に誤りがあります');
        return false;
      }
      //既に登録されているemailがあれば「登録済み」とする
      const mail = res.response.find((user) => user.Email === email_auth.value);
      if (mail) {
        alert('既に登録されてあるメールアドレスです');
        return false;
      }
      console.log('登録完了');
      //console.log(document.cookie);
      $.ajax({
        url: '/auth/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'cipher',
          username: userName.value,
          email: email_auth.value,
          password: password_auth.value,
        }),
        success: function (res) {
          //console.log(res.token);
          location.href = 'https://nodejs-itnote-app.herokuapp.com/mypage';
        },
      });
    },
  });
}
