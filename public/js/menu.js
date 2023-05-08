//バージョンのポップアップ
document.getElementById('version').addEventListener('click', () => {
  document.getElementById('popup-overlay_version').style.display = 'block';
});

document.getElementById('pop-delete_version').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_version').style.display = 'none';
});

document
  .getElementById('popup-overlay_version')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_version');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//問い合わせのポップアップ出力
document.getElementById('inquiry').addEventListener('click', () => {
  document.getElementById('popup-overlay_inquiry').style.display = 'block';
});

document.getElementById('pop-delete_inquiry').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_inquiry').style.display = 'none';
});

//[全削除]ボタン押下時。ノート,フォルダ,タブ全て削除
document
  .getElementById('popup-overlay_delete')
  .addEventListener('click', () => {
    //はいを押した場合(true)
    document.getElementById('popup-overlay_inquiry').style.display = 'block';
  });

document.getElementById('yes-button').addEventListener('click', () => {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'deleteALL',
    }),
    success: function (res) {
      //全削除
      $('#0').empty();
      $('#tab').empty();
      let p = document.createElement('p');
      p.setAttribute('id', 'notab');
      p.innerHTML = 'こちらにnoteが出力されます';
      document.getElementById('tab').appendChild(p);
      document.getElementById('notepass').innerHTML = '';
    },
  });
});

document.getElementById('pop-delete_delete').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_delete').style.display = 'none';
});

document.getElementById('no-button').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_delete').style.display = 'none';
});

document
  .getElementById('popup-overlay_delete')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_delete');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//[ログアウト]押下後、サーバーでCookieを削除
document.getElementById('logout').addEventListener('click', () => {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'cookiedelete',
    }),
    success: function (res) {},
  });
});
