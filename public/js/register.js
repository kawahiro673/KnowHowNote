import { currentTimeGet } from './stringUtils.js';

const userName = document.getElementById('username');
const password_auth = document.getElementById('password_auth');
const cfPassword = document.getElementById('confirmedPassword');
const elements = document.querySelectorAll('.authinput');
const message = document.querySelector('.auth-error-message');

document
  .getElementById('registerbtn')
  .addEventListener('click', registerButtonClick);

function registerButtonClick() {
  elements.forEach(function (element) {
    element.style.border = '1px solid black';
  });
  message.style.display = 'none';
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
        password_auth.value === '' ||
        cfPassword.value === ''
      ) {
        elements.forEach(function (element) {
          if (element.value === '') {
            element.style.border = '1px solid red';
          }
        });
        message.style.display = 'block';
        message.innerHTML = '入力されていない情報があります';
        return false;
      }
      // 20文字以内で、英数字のみを含むかを正規表現で判定
      if (!validateUsername(userName.value)) {
        message.style.display = 'block';
        message.innerHTML = 'ユーザー名は20文字以内の英数字を使用してください';
        userName.style.border = '1px solid red';
        return false;
      }

      //ユーザー名かぶりチェック
      const user = res.response.find(
        (user) => user.UserName === userName.value
      );
      if (user) {
        message.style.display = 'block';
        message.innerHTML = 'そのユーザーは登録できません';
        userName.style.border = '1px solid red';
        return false;
      }

      // パスワードの文字数(8文字以上)と英数字チェック
      if (
        password_auth.value.length < 8 ||
        !/^[a-zA-Z0-9]+$/.test(password_auth.value)
      ) {
        message.style.display = 'block';
        message.innerHTML =
          'パスワードは8文字以上の半角英数字を使用してください';
        password_auth.style.border = '1px solid red';
        return false;
      }

      //確認用パスワード入力チェック
      if (password_auth.value !== cfPassword.value) {
        message.style.display = 'block';
        message.innerHTML = 'パスワードの入力に誤りがあります';
        password_auth.style.border = '1px solid red';
        cfPassword.style.border = '1px solid red';
        return false;
      }

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

// 20文字以内で、英数字のみを含むかを正規表現で判定
function validateUsername(username) {
  const pattern = /^[a-zA-Z0-9]{1,20}$/;
  return pattern.test(username);
}
