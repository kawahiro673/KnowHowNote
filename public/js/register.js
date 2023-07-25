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
    elements.forEach(function(element) {
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
        // email_auth.value === '' ||
        password_auth.value === '' ||
        cfPassword.value === ''
      ) {
        // alert('入力されていない情報があります');
          elements.forEach(function(element) {
         if(element.value ===''){
    element.style.border = '1px solid red';
         } 
    });
          message.style.display = 'block';
        message.innerHTML = '入力されていない情報があります'
        return false;
      }
      //ユーザー名かぶりチェック
      const user = res.response.find(
        (user) => user.UserName === userName.value
      );
      if (user) {
        // alert('そのユーザーは登録できません');
         message.style.display = 'block';
         message.innerHTML = 'そのユーザーは登録できません'
       userName.style.border = '1px solid red';
        return false;
      }
      //確認用パスワード入力チェック
      if (password_auth.value !== cfPassword.value) {
        // alert('パスワードの入力に誤りがあります');
         message.style.display = 'block';
         message.innerHTML = 'パスワードの入力に誤りがあります'
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
