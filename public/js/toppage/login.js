import {
  currentTimeGet,
  validateEmail,
  explanationPopUp,
  resultPopUp_indelible,
} from '../stringUtils.js';

const loginbtn = document.getElementById('loginbtn');
const password = document.getElementById('password');
const username = document.getElementById('username_login');
const elements = document.querySelectorAll('.logininput');

setTimeout(() => {
  $('.front_cover').trigger('click');
}, 500);

loginbtn.addEventListener('click', loginButtonClick);

document
  .getElementById('pass-forget')
  .addEventListener('click', function (event) {
    event.preventDefault(); // デフォルトのクリック動作をキャンセル
    document.getElementById('popup-overlay_pass-forget').style.display =
      'block';
  });

document
  .getElementById('pop-delete_pass-forget')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_pass-forget').style.display = 'none';
  });

document
  .getElementById('popup-overlay_pass-forget')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_pass-forget');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

document.getElementById('pass-change').addEventListener('click', (e) => {
  const userName = document.getElementById('username-pop').value;
  const email = document.getElementById('email').value;
  const flg = validateEmail(email);
  if (flg) {
    $.ajax({
      url: '/mailer/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        userName,
        email,
      }),
      success: function (res) {
        if (res.msg === 'nothingUser') {
          explanationPopUp('パスワード変更', 'ユーザーが見つかりませんでした');
        } else if (res.msg === 'nothingEmail') {
          explanationPopUp(
            'パスワード変更',
            '正しいメールアドレスが入力されていません'
          );
        } else {
          explanationPopUp(
            'パスワード変更',
            '指定のアドレスにメールを送信しました　URLから新しくパスワードを設定してください'
          );
          document.getElementById('popup-overlay_pass-forget').style.display =
            'none';
        }
      },
    });
  } else {
    explanationPopUp(
      'パスワード変更',
      '正しいメールアドレスが入力されていません'
    );
  }
});

function loginButtonClick() {
  elements.forEach(function (element) {
    element.style.border = '1px solid black';
  });
  document.querySelector('.login-error-message').style.display = 'none';
  if (password.value === '' || username.value === '') {
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
          document.querySelector('.login-error-message').style.display =
            'block';
          document.querySelector('.login-error-message').innerHTML =
            'ユーザー名またはパスワードが間違っています';

          elements.forEach(function (element) {
            element.style.border = '1px solid red';
          });
        } else {
          resultPopUp_indelible(
            'ログイン',
            'ログイン中です<br>しばらくお待ちください'
          );
          //ajax通信を使用していると、nodejs(サーバーサイド)側でredirect()が使用できないっぽいのでこちらを使用
          location.href = res.url;
        }
      },
    });
  }
}

document.getElementById('login-move-button').addEventListener('click', (e) => {

   if (window.innerWidth <= 1000) {
    document.getElementById('loginbtn').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
$('.next-page-arrow').trigger('click');
  setTimeout(() => { 
  $('.explanation-1').trigger('click');
  setTimeout(() => {
    $('.explanation-2').trigger('click');
    setTimeout(() => {
      $('.explanation-3').trigger('click');
    }, 250);
  }, 250);
 }, 250);   
   }
});
