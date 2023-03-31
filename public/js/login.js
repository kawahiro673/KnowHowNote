const loginbtn = document.getElementById('loginbtn');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginbtn.addEventListener('click', loginButtonClick);

function loginButtonClick() {
  console.log('ログインボタンクリック');
  //console.log(document.cookie);
  $.ajax({
    url: '/login/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'info',
      email: email.value,
      password: password.value,
      //cookieToken: document.cookie,
    }),
    success: function (res) {
      if (res.message !== 'ok') alert(res.message);
      //ajax通信を使用していると、nodejs(サーバーサイド)側でredirect()が使用できないっぽい
      location.href = 'https://nodejs-itnote-app.herokuapp.com/mypage';
    },
  });
}
