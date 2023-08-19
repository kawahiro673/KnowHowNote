import {
  currentTimeGet,
  validateEmail,
  explanationPopUp,
  generateRandomString,
} from '../stringUtils.js';

const gestloginbtn = document.getElementById('gestloginbtn');

gestloginbtn.addEventListener('click', gestloginButtonClick);

function gestloginButtonClick() {
  console.log('ゲストボタンクリック');
  $.ajax({
    url: '/gestLogin/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      time: currentTimeGet,
      name: `user_${generateRandomString(12)}`,
    }),
    success: function (res) {
      location.href = res.url;
    },
  });
}
