import { currentTimeGet } from './stringUtils.js';

const loginbtn = document.getElementById('loginbtn');
const password = document.getElementById('password');
const username = document.getElementById('username_login');
const elements = document.querySelectorAll('.logininput');

loginbtn.addEventListener('click', loginButtonClick);

function loginButtonClick() {
  elements.forEach(function (element) {
    element.style.border = '1px solid black';
  });
  document.querySelector('.login-error-message').style.display = 'none';
  if (password.value === '' || username.value === '') {
    // alert('入力されていない情報があります');
    elements.forEach(function (element) {
      if (element.value === '') {
        element.style.border = '1px solid red';
      }
    });
    document.querySelector('.login-error-message').style.display = 'block';
    document.querySelector('.login-error-message').innerHTML =
      '入力されていない情報があります';
    return false;
  } else {
    const time = currentTimeGet();
    $.ajax({
      url: '/login/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'info',
        username: username.value,
        password: password.value,
        time,
      }),
      success: function (res) {
        if (res.message !== 'ok') {
          //alert(res.message);
          document.querySelector('.login-error-message').style.display =
            'block';
          document.querySelector('.login-error-message').innerHTML =
            'ユーザー名またはパスワードが間違っています';

          elements.forEach(function (element) {
            element.style.border = '1px solid red';
          });
        } else {
          //ajax通信を使用していると、nodejs(サーバーサイド)側でredirect()が使用できないっぽいのでこちらを使用
          location.href = res.url;
        }
      },
    });
  }
}
