const userName = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cfPassword = document.getElementById('confirmedPassword');

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
      //console.log(res.response);
      //未入力確認
      if (
        userName.value === '' ||
        email.value === '' ||
        password.value === '' ||
        cfPassword.value === ''
      ) {
        alert('入力されていない情報があります');
        return false;
      }

      //ユーザーかぶりチェック
      const user = res.response.find(
        (user) => user.UserName === userName.value
      );
      if (user) {
        alert('そのユーザーは登録できません');
        return false;
      }
      //emailバリデーションチェック
      if (!email.value.match(/.+@.+\..+/)) {
        alert('正しいメールアドレスを入力してください');
        return false;
      }
      //パスワード２回目入力チェック
      if (password.value !== cfPassword.value) {
        alert('パスワードの入力に誤りがあります');
        return false;
      }

      const mail = res.response.find((user) => user.Email === email.value);
      if (mail) {
        alert('既にそのユーザは存在しています');
        return false;
      }

      console.log('登録が完了しました');
    },
  });
}
