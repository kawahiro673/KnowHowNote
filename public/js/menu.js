import { hashedIdGet } from './main.js';

//プロフィールのポップアップ
document.getElementById('profile').addEventListener('click', () => {
  document.getElementById('popup-overlay_profile').style.display = 'block';
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'RegisterUser',
    }),
    success: function (res) {
      document.getElementById('myName').innerHTML = res.user.UserName;
      document.getElementById('mail').innerHTML = res.email;
      const date = new Date(res.user.CreationDay);
      document.getElementById('RegistrationDate').innerHTML =
        date.toLocaleDateString('ja-JP');
    },
  });
  backgroundColorChrckBoxOption();
});

document.getElementById('pop-delete_profile').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_profile').style.display = 'none';
});

document
  .getElementById('popup-overlay_profile')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_profile');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//共有履歴のポップアップ
document.getElementById('share-history').addEventListener('click', () => {
  document.getElementById('popup-overlay_share-history').style.display =
    'block';
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'ShareList',
    }),
    success: function (res) {
      //履歴が未作成の時(連続で押下するたびに作成されるため)
      if (
        !(
          document
            .getElementById('share-history-list')
            .getElementsByTagName('p').length > 0
        )
      ) {
        res.shareResult.forEach((share) => {
          const p = document.createElement('p');
          p.setAttribute('class', 'share-user-list');
          p.innerHTML = `${share.date}          ${share.UserName}          ${share.ShareNoteTitle}`;
          document.getElementById('share-history-list').appendChild(p);
        });
        if (res.shareResult.length === 0) {
          console.log('作成されていません');
          const p = document.createElement('p');
          p.innerHTML = '共有履歴がありません';
          document.getElementById('share-history-list').appendChild(p);
        }
      }
    },
  });
});

document
  .getElementById('pop-delete_share-history')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_share-history').style.display =
      'none';

    while (document.getElementById('share-history-list').firstChild) {
      document
        .getElementById('share-history-list')
        .removeChild(document.getElementById('share-history-list').firstChild);
    }
  });

document
  .getElementById('popup-overlay_share-history')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_share-history');
    if (e.target === popup) {
      popup.style.display = 'none';
      while (document.getElementById('share-history-list').firstChild) {
        document
          .getElementById('share-history-list')
          .removeChild(
            document.getElementById('share-history-list').firstChild
          );
      }
    }
  });

//使い方のポップアップ
document.getElementById('explanation').addEventListener('click', () => {
  document.getElementById('popup-overlay_explanation').style.display = 'block';
});

document
  .getElementById('pop-delete_explanation')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_explanation').style.display = 'none';
  });

document
  .getElementById('popup-overlay_explanation')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_explanation');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

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

//ログアウトポップアップ
document.getElementById('logout').addEventListener('click', () => {
  document.getElementById('popup-overlay_logout').style.display = 'block';
});

document.getElementById('yes-button-logout').addEventListener('click', () => {
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'cookiedelete',
    }),
    success: function (res) {
      location.href = 'https://nodejs-itnote-app.herokuapp.com';
    },
  });
});

document.getElementById('pop-delete_logout').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_logout').style.display = 'none';
});

document.getElementById('no-button-logout').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_logout').style.display = 'none';
});

document
  .getElementById('popup-overlay_logout')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_logout');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//[全削除]ボタン押下時。ノート,フォルダ,タブ全て削除
document.getElementById('all-delete').addEventListener('click', () => {
  //はいを押した場合(true)
  document.getElementById('popup-overlay_delete').style.display = 'block';
});

document.getElementById('yes-button-delete').addEventListener('click', () => {
  $.ajax({
    url: '/mypage/' + hashedIdGet,
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
      document.getElementById('popup-overlay_delete').style.display = 'none';
    },
  });
});

document.getElementById('pop-delete_delete').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_delete').style.display = 'none';
});

document.getElementById('no-button-delete').addEventListener('click', (e) => {
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

const backgroundColorChrckBoxOption = () => {
  const checkboxes = document.querySelectorAll('.checkbox-color');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (checkbox.checked) {
        const label = checkbox.parentElement; // 親要素の<label>を取得
        const text = label.textContent.trim(); // ラベル要素のテキストを取得し、前後の空白をトリム

        // チェックされているチェックボックスのテキストを使って適切な処理を行う
        switch (text) {
          case '赤':
            console.log('赤が選択されました');
            break;
          case '青':
            console.log('青が選択されました');
            break;
          case '黄':
            console.log('黄が選択されました');
            break;
          case '緑':
            console.log('緑が選択されました');
            break;
          case '紫':
            console.log('紫が選択されました');
            break;
          case '橙':
            console.log('橙が選択されました');
            break;
          case '灰色':
            console.log('灰色が選択されました');
            break;
          default:
            // チェックされているテキストが上記以外の場合の処理
            break;
        }
      }
    });
  });
};
