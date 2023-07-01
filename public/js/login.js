const loginbtn = document.getElementById('loginbtn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const username = document.getElementById('username_login');

loginbtn.addEventListener('click', loginButtonClick);

function loginButtonClick() {
  $.ajax({
    url: '/login/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'info',
      email: email.value,
      username: username.value,
      password: password.value,
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
