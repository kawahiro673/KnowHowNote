export function keepButton(
  id,
  textarea,
  p1,
  fadeFont,
  inputKeep,
  inputCancel,
  inputEdit,
  time,
  newTitle,
  titletext,
  pass
) {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'note',
      flg: 'noteKeep',
      id,
      titleContent: newTitle, //p.innerHTML,
      memoContent: textarea.value, //ここに入力した値が入る
      pass,
    }),
    success: function (res) {
      //console.log(res.response2);
      fadeFont.style.visibility = 'visible';
      //1000ミリ秒後に表示を隠す
      setTimeout(function () {
        fadeFont.style.visibility = 'hidden';
        // updateTime.innerHTML = res.response2.saved_time;
      }, 1000);
    },
  });
  p1.remove();
  inputKeep.remove();
  inputCancel.remove();
  document.getElementById(`tabP${id}`).innerHTML = newTitle;
  document.getElementById(`tabP${id}`).style.display = 'block';
  document.getElementById(`tabname${id}`).innerHTML = newTitle;
  document.getElementById(`li${id}`).innerHTML = newTitle;
  titletext.remove();
  inputEdit.style.display = 'block';
  textarea.readOnly = true;
  //updateTime(id, time);
  document.getElementById('notepass').innerHTML = pass;
}

export function cancelButton(
  id,
  p1,
  inputKeep,
  inputCancel,
  inputEdit,
  textarea,
  titletext
) {
  console.log('取り消すクリック');
  let btn = confirm(
    '本当に編集を取り消しますか？\n保存していないものは取り消されます。'
  );
  if (btn) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'note',
        flg: 'info',
        id,
      }),
      success: function (res) {
        textarea.value = res.response.memo_text;
      },
    });
    document.getElementById(`tabP${id}`).style.display = 'block';
    p1.remove();
    inputKeep.remove();
    inputCancel.remove();
    titletext.remove();
    inputEdit.style.display = 'block';
    textarea.readOnly = true;
  }
}
