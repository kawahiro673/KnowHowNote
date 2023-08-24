import {
  currentTimeGet,
  validatePassword,
  validateUsername,
  validateEmail,
  resultPopUp
} from '../stringUtils.js';

const userName = document.getElementById('username');
const password_auth = document.getElementById('password_auth');
const cfPassword = document.getElementById('confirmedPassword');
const authEmail = document.getElementById('authEmail');
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
    if (element.value === '' && element.getAttribute('name') !== 'email') {
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

      // パスワードの文字数(8文字以上20文字以内)と英数字チェック
      if (!validatePassword(password_auth.value)) {
        message.style.display = 'block';
        message.innerHTML =
          'パスワードは8文字以上20文字以下の半角英数字を使用してください';
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

       //メールアドレスに何か入力されていれば、バリデーションチェック
      if (authEmail.value !== '' &&  !validateEmail(authEmail.value)) {
        message.style.display = 'block';
        message.innerHTML = 'メールアドレスの入力に誤りがあります';
        authEmail.style.border = '1px solid red';
        return false;
      }

       if (authEmail.value === '') {
        authEmail.value = '未設定';
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
          email: authEmail.value,
          time,
        }),
        success: function (res) {
          resultPopUp('新規登録','ログインしています。しばらくお待ちください。\n確認用のメールを送信しました。メールが届いていなければ正しいメールアドレスを個別設定から入力し直してください。')
          location.href = res.url;
        },
      });
    },
  });
}
