const userName = document.getElementsByClassName('username');
const email = document.getElementsByClassName('email');
const password = document.getElementsByClassName('password');
const cfPassword = document.getElementsByClassName('confirmedPassword');

document
  .getElementById('register')
  .addEventListener('click', registerButtonClick);

function registerButtonClick() {
  console.log('クリックしました');
  $.ajax({
    url: '/auth/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'info',
    }),
    success: function (res) {
      console.log(res.response);
    },
  });
}
