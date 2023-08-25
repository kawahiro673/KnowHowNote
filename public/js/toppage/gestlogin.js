import {
  currentTimeGet,
  explanationPopUp,
  generateRandomString,
   resultPopUp_indelible
} from '../stringUtils.js';

const gestloginbtn = document.getElementById('gestloginbtn');

gestloginbtn.addEventListener('click', gestloginButtonClick);

function gestloginButtonClick() {
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
      resultPopUp_indelible('ゲストログイン','ログイン中です<br>しばらくお待ちください');
      location.href = res.url;
    },
  });
}
