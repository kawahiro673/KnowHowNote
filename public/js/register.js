import { currentTimeGet } from './stringUtils.js';

const userName = document.getElementById('username');
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
        // email_auth.value === '' ||
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
      //確認用パスワード入力チェック
      if (password_auth.value !== cfPassword.value) {
        alert('パスワードの入力に誤りがあります');
        return false;
      }
      console.log('登録完了');

      const time = currentTimeGet();
      $.ajax({
        url: '/auth/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'cipher',
          username: userName.value,
          password: password_auth.value,
          time,
        }),
        success: function (res) {
          location.href = res.url;
        },
      });
    },
  });
}
