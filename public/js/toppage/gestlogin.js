import {
  currentTimeGet,
  explanationPopUp,
  generateRandomString,
  resultPopUp_indelible,
  answerPopUp,
} from '../stringUtils.js';

const gestloginbtn = document.getElementById('gestloginbtn');

gestloginbtn.addEventListener('click', gestloginButtonClick);

async function gestloginButtonClick() {
  const result = await answerPopUp(
    'ゲストログイン',
    'ゲストユーザーとしてログインしますが<br>よろしいですか<br>※一部機能は使用できません'
  );
  if (result === true) {
    const time = currentTimeGet();
    $.ajax({
      url: '/gestLogin/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        time,
        name: `GestUser_${generateRandomString(12)}`,
      }),
      success: function (res) {
        resultPopUp_indelible(
          'ゲストログイン',
          'ログイン中です<br>しばらくお待ちください'
        );
        location.href = res.url;
      },
    });
  }
}
