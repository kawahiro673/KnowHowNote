import { currentTimeGet } from './stringUtils.js';

const loginbtn = document.getElementById('loginbtn');
const password = document.getElementById('password');
const username = document.getElementById('username_login');

loginbtn.addEventListener('click', loginButtonClick);

function loginButtonClick() {
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
        alert(res.message);
      } else {
        //ajax通信を使用していると、nodejs(サーバーサイド)側でredirect()が使用できないっぽいのでこちらを使用
        location.href = res.url;
      }
    },
  });
}
