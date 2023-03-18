const userName = document.getElementsById('username');
const email = document.getElementsById('email');
const password = document.getElementsById('password');
const cfPassword = document.getElementsById('confirmedPassword');

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
      console.log(userName.value);
      const user = res.response.find(
        (user) => user.UserName === userName.value
      );
      if (user) {
        alert('そのユーザーは登録できません');
      }
    },
  });
}
