import {
  currentTimeGet,
  explanationPopUp,
  generateRandomString,
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
      location.href = res.url;
    },
  });
}
