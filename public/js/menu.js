import { hashedIdGet } from './main.js';
import { currentTimeGet } from './stringUtils.js';

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
      document.getElementById('share-pass-input').value = res.user.SharePass;
      const date = new Date(res.user.CreationDay);
      document.getElementById('RegistrationDate').innerHTML =
        date.toLocaleDateString('ja-JP');
      if (res.user.ShareFlg === 'ON') {
        document.getElementById('onCheckbox').checked = true;
      } else if (res.user.ShareFlg === 'OFF') {
        document.getElementById('offCheckbox').checked = true;
      }
      if (res.user.BackgroundColor === 'red') {
        document.getElementById('checkbox-color-red').checked = true;
      } else if (res.user.BackgroundColor === 'blue') {
        document.getElementById('checkbox-color-blue').checked = true;
      } else if (res.user.BackgroundColor === 'yellow') {
        document.getElementById('checkbox-color-yellow').checked = true;
      } else if (res.user.BackgroundColor === 'green') {
        document.getElementById('checkbox-color-green').checked = true;
      } else if (res.user.BackgroundColor === 'purple') {
        document.getElementById('checkbox-color-purple').checked = true;
      } else if (res.user.BackgroundColor === 'orange') {
        document.getElementById('checkbox-color-orange').checked = true;
      } else if (res.user.BackgroundColor === 'gray') {
        document.getElementById('checkbox-color-gray').checked = true;
      }
    },
  });
  backgroundColorCheckBoxOption();
  shareFunctionCheckBoxOption();
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
          const p = document.createElement('p');
          p.innerHTML = '共有履歴がありません';
          p.setAttribute('class', 'no-share-user');
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

const backgroundColorCheckBoxOption = () => {
  const checkboxes = document.querySelectorAll('.checkbox-color');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (checkbox.checked) {
        const label = checkbox.parentElement; // 親要素の<label>を取得
        const text = label.textContent.trim(); // ラベル要素のテキストを取得し、前後の空白をトリム

        // チェックされているチェックボックスのテキストを使って適切な処理を行う
        switch (text) {
          case '赤':
            backgroundColorPreservation('red');
            break;
          case '青':
            backgroundColorPreservation('blue');
            break;
          case '黄':
            backgroundColorPreservation('yellow');
            break;
          case '緑':
            backgroundColorPreservation('green');
            break;
          case '紫':
            backgroundColorPreservation('purple');
            break;
          case '橙':
            backgroundColorPreservation('orange');
            break;
          case '灰色':
            backgroundColorPreservation('gray');
            break;
          default:
            // チェックされているテキストが上記以外の場合の処理
            break;
        }
      } else {
        checkbox.checked = true; // チェックが外れた場合に再度チェックを付ける
      }
    });
  });
};

const backgroundColorPreservation = (color) => {
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'backgroundColor',
      color,
    }),
    success: function (res) {
      backgroundColorDelete();

      if (color === 'red') {
        backgroundColorSet('red');
      } else if (color === 'blue') {
        backgroundColorSet('blue');
      } else if (color === 'yellow') {
        backgroundColorSet('yellow');
      } else if (color === 'green') {
        backgroundColorSet('green');
      } else if (color === 'purple') {
        backgroundColorSet('purple');
      } else if (color === 'orange') {
        backgroundColorSet('orange');
      } else if (color === 'gray') {
        backgroundColorSet('gray');
      }
    },
  });
};

const shareFunctionCheckBoxOption = () => {
  const checkboxes = document.querySelectorAll('.checkbox-share');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (checkbox.checked) {
        const label = checkbox.parentElement; // 親要素の<label>を取得
        const text = label.textContent.trim(); // ラベル要素のテキストを取得し、前後の空白をトリム
        console.log(text);
        switch (text) {
          case 'ON':
            shareFunctionCheckBoxFlg('ON');
            break;
          case 'OFF':
            shareFunctionCheckBoxFlg('OFF');
            break;
          default:
            // チェックされているテキストが上記以外の場合の処理
            break;
        }
      } else {
        checkbox.checked = true; // チェックが外れた場合に再度チェックを付ける
      }
    });
  });
};

const shareFunctionCheckBoxFlg = (checkbox) => {
  console.log(checkbox);
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'shareFunctionCheckBoxFlg',
      checkbox,
    }),
    success: function (res) {},
  });
};

$('.checkbox-color').on('click', (event) => {
  const clickedCheckbox = event.target;
  const checkboxes = document.getElementsByName('checkbox');
  checkboxes.forEach((cb) => {
    if (cb !== clickedCheckbox) {
      cb.checked = false;
    }
  });
});

$('.checkbox-share').on('click', (event) => {
  const clickedCheckbox = event.target;
  const checkboxes = document.getElementsByName('checkboxshare');
  checkboxes.forEach((cb) => {
    if (cb !== clickedCheckbox) {
      cb.checked = false;
    }
  });
});

document.getElementById('share-pass-butotn').addEventListener('click', () => {
  console.log(document.getElementById('share-pass-input').value);
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'register_user_update',
      sharePass: document.getElementById('share-pass-input').value,
    }),
    success: function (res) {},
  });
});

export const backgroundColorSet = (color) => {
  document
    .querySelector('.container')
    .classList.add(`backgroundColor-${color}`);
  document.querySelector('header').classList.add(`headerColor-${color}`);
  document.querySelector('section').classList.add(`section-${color}`);
  document.querySelector('.dropLabel').classList.add(`dropLabel-${color}`);
  document.querySelector('.tab-wrap').classList.add(`tab-wrap-${color}`);
  document.querySelector('.dropInput').classList.add(`dropInput-${color}`);
  document.querySelector('.cube1').classList.add(`cube1-${color}`);
  document.querySelector('.cube2').classList.add(`cube2-${color}`);
  document.querySelector('.cube3')[0].classList.add(`cube3-${color}`);
  document.querySelector('.cube4')[0].classList.add(`cube4-${color}`);
  document.querySelector('.cube3')[1].classList.add(`cube3-${color}`);
  document.querySelector('.cube4')[1].classList.add(`cube4-${color}`);
  const icons = document.querySelectorAll('i');
  icons.forEach((icon) => {
    icon.classList.add(`i-${color}`);
  });
};

export const backgroundColorDelete = () => {
  const container = document.querySelector('.container');
  container.classList.remove('backgroundColor-red');
  container.classList.remove('backgroundColor-yellow');
  container.classList.remove('backgroundColor-blue');
  container.classList.remove('backgroundColor-green');
  container.classList.remove('backgroundColor-purple');
  container.classList.remove('backgroundColor-orange');
  container.classList.remove('backgroundColor-gray');

  const header = document.querySelector('header');
  header.classList.remove('headerColor-red');
  header.classList.remove('headerColor-yellow');
  header.classList.remove('headerColor-blue');
  header.classList.remove('headerColor-green');
  header.classList.remove('headerColor-purple');
  header.classList.remove('headerColor-orange');
  header.classList.remove('headerColor-gray');

  const section = document.querySelector('section');
  section.classList.remove('section-red');
  section.classList.remove('section-yellow');
  section.classList.remove('section-blue');
  section.classList.remove('section-green');
  section.classList.remove('section-purple');
  section.classList.remove('section-orange');
  section.classList.remove('section-gray');

  const dropLabel = document.querySelector('.dropLabel');
  dropLabel.classList.remove('dropLabel-red');
  dropLabel.classList.remove('dropLabel-yellow');
  dropLabel.classList.remove('dropLabel-blue');
  dropLabel.classList.remove('dropLabel-green');
  dropLabel.classList.remove('dropLabel-purple');
  dropLabel.classList.remove('dropLabel-orange');
  dropLabel.classList.remove('dropLabel-gray');

  const tabWrap = document.querySelector('.tab-wrap');
  tabWrap.classList.remove('tab-wrap-red');
  tabWrap.classList.remove('tab-wrap-yellow');
  tabWrap.classList.remove('tab-wrap-blue');
  tabWrap.classList.remove('tab-wrap-green');
  tabWrap.classList.remove('tab-wrap-purple');
  tabWrap.classList.remove('tab-wrap-orange');
  tabWrap.classList.remove('tab-wrap-gray');

  const dropInput = document.querySelector('.dropInput');
  dropInput.classList.remove('dropInput-red');
  dropInput.classList.remove('dropInput-yellow');
  dropInput.classList.remove('dropInput-blue');
  dropInput.classList.remove('dropInput-green');
  dropInput.classList.remove('dropInput-purple');
  dropInput.classList.remove('dropInput-orange');
  dropInput.classList.remove('dropInput-gray');

  const cube1 = document.querySelector('.cube1')[0];
  cube1.classList.remove(`cube1-red`);
  cube1.classList.remove(`cube1-blue`);

  const cube2 = document.querySelector('.cube2')[0];
  cube2.classList.remove(`cube2-red`);
  cube2.classList.remove(`cube2-blue`);

  const cube3 = document.querySelector('.cube3')[0];
  cube3.classList.remove(`cube3-red`);
  cube3.classList.remove(`cube3-blue`);

  const cube4 = document.querySelector('.cube4')[0];
  cube4.classList.remove(`cube4-red`);
  cube4.classList.remove(`cube4-blue`);

  const cube1_1 = document.querySelector('.cube1')[1];
  cube1_1.classList.remove(`cube1-red`);
  cube1_1.classList.remove(`cube1-blue`);

  const cube2_1 = document.querySelector('.cube2')[1];
  cube2_1.classList.remove(`cube2-red`);
  cube2.classList.remove(`cube2-blue`);

  const cube3_1 = document.querySelector('.cube3')[1];
  cube3_1.classList.remove(`cube3-red`);
  cube3_1.classList.remove(`cube3-blue`);

  const cube4_1 = document.querySelector('.cube4')[1];
  cube4_1.classList.remove(`cube4-red`);
  cube4_1.classList.remove(`cube4-blue`);

  const icons = document.querySelectorAll('i');
  icons.forEach((icon) => {
    icon.classList.remove('i-red');
    icon.classList.remove('i-yellow');
    icon.classList.remove('i-blue');
    icon.classList.remove('i-green');
    icon.classList.remove('i-purple');
    icon.classList.remove('i-orange');
    icon.classList.remove('i-gray');
  });
};

document.getElementById('inquiry-button').addEventListener('click', () => {
  document.getElementById('popup-overlay_inquiry_result').style.display =
    'block';
  const date = currentTimeGet();
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'inquiry',
      content: document.getElementById('inquiry-content').value,
      user: document.getElementById('user_name').innerHTML,
      date,
      type: document.getElementById('itemSelect').value,
    }),
    success: function (res) {
      document.getElementById('popup-overlay_inquiry').style.display = 'none';
      document.getElementById('popup-overlay_inquiry_result').style.display =
        'block';
      setTimeout(() => {
        document.getElementById('popup-overlay_inquiry_result').style.display =
          'none';
      }, 1500);
    },
  });
});
