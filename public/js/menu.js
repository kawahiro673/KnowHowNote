//MENUボタンの主な機能を実装

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
      document.getElementById('authentication-ID').innerHTML =
        res.user.Authentication_ID;
      // document.getElementById('share-pass-input').value = res.user.SharePass;
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
        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('id', 'share-history-table');
        const headerRow = document.createElement('tr');
        headerRow.setAttribute('class', 'share-table-header');
        const header0 = document.createElement('th');
        header0.textContent = '';
        const header1 = document.createElement('th');
        header1.setAttribute('id', 'share-history-date');
        header1.textContent = '共有日時';
        const span1 = document.createElement('span');
        span1.setAttribute('id', 'dateSortIndicator');
        const header2 = document.createElement('th');
        header2.setAttribute('id', 'share-history-user');
        header2.textContent = 'ユーザー名';
        const span2 = document.createElement('span');
        span2.setAttribute('id', 'userSortIndicator');
        const header3 = document.createElement('th');
        header3.textContent = 'ノウハウ';

        headerRow.appendChild(header0);
        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        headerRow.appendChild(header3);
        header1.appendChild(span1);
        header2.appendChild(span2);

        document.getElementById('share-history-list').appendChild(table);
        table.appendChild(headerRow);

        res.shareResult.forEach((share) => {
          const dataRow1 = document.createElement('tr');
          const dataCell0 = document.createElement('td');
          const img = document.createElement('img');
          //共有を「された」のか「した」のか判別
          if (share.Share_ToDo_Flg === 'True') {
            img.src = '../img/share-to-do.png';
            dataCell0.setAttribute('data-share-status', 'ToDo');
          } else {
            img.src = '../img/share-to-be.png';
            dataCell0.setAttribute('data-share-status', 'ToBe');
          }
          dataCell0.appendChild(img);
          const dataCell1 = document.createElement('td');
          dataCell1.textContent = share.date;
          const dataCell2 = document.createElement('td');
          dataCell2.textContent = share.UserName;
          const dataCell3 = document.createElement('td');
          dataCell3.textContent = share.ShareNoteTitle;
          dataRow1.appendChild(dataCell0);
          dataRow1.appendChild(dataCell1);
          dataRow1.appendChild(dataCell2);
          dataRow1.appendChild(dataCell3);
          table.appendChild(dataRow1);

          shareHistoryTableDownList();
          document
            .getElementById('share-history-date')
            .addEventListener('click', sortTableByDate);
          document
            .getElementById('share-history-user')
            .addEventListener('click', sortTableByUser);
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

    const table = document.getElementById('share-history-table');
    table.parentNode.removeChild(table);
  });

document
  .getElementById('popup-overlay_share-history')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_share-history');
    if (e.target === popup) {
      popup.style.display = 'none';

      const table = document.getElementById('share-history-table');
      table.parentNode.removeChild(table);
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

//このサイトについてのポップアップ
document.getElementById('About-Website').addEventListener('click', () => {
  document.getElementById('popup-overlay_About-Website').style.display =
    'block';
});

document
  .getElementById('pop-delete_About-Website')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_About-Website').style.display =
      'none';
  });

document
  .getElementById('popup-overlay_About-Website')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_About-Website');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//フレンドリストのポップアップ出力
document.getElementById('friend-list').addEventListener('click', async () => {
  document.getElementById('popup-overlay_friend-list').style.display = 'block';

  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'RegisterUser',
    }),
    success: async function (res) {
      document.getElementById('myID').innerHTML = res.user.Authentication_ID;
      await friendListUpdate();
      //フレンドをフレンドリストから削除
      const deleteButtons = document.querySelectorAll('.friend-delete');
      deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', (event) => {
          const friendName = event.target
            .closest('.friend-Box')
            .querySelector('.friend-name').textContent;
          document.getElementById(
            'popup-overlay_friend-delete-q'
          ).style.display = 'block';
          document.getElementById('friend-delete-q-user').innerHTML =
            friendName;
        });
      });

      //グループリスト表示
      document
        .querySelectorAll('.group-name-change-button')
        .forEach(async function (button) {
          button.addEventListener('click', async function (event) {
            event.preventDefault(); // リンクのデフォルトの動作を無効化
            document.getElementById('popup-overlay_group-list').style.display =
              'block';
            await groupCheckListScreen(button);
            const id = button.id.match(/\d+/)[0];

            document
              .getElementById('group-list-decision-button')
              .addEventListener('click', () => {
                let extracted;
                const checkboxes = document.querySelectorAll(
                  '.group-list-check-div input[type="radio"]'
                );
                for (let i = 0; i < checkboxes.length; i++) {
                  if (checkboxes[i].checked) {
                    extracted = checkboxes[i].id.replace('checkbox-group', '');
                    console.log(extracted);
                  }
                }
                $.ajax({
                  url: '/mypage/' + hashedIdGet,
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'group_update',
                    id,
                    group: extracted,
                  }),
                  success: function (res) {
                    document.getElementById(
                      'popup-overlay_group-list'
                    ).style.display = 'none';
                    friendListUpdate();
                  },
                });
              });
          });
        });

      document
        .getElementById('pop-delete_group-list')
        .addEventListener('click', function (event) {
          event.preventDefault(); // リンクのデフォルトの動作を無効化
          document.getElementById('popup-overlay_group-list').style.display =
            'none';
        });

      //フレンドの名前を変更
      const changeNameButtons = document.querySelectorAll(
        '.friend-change-name'
      );
      changeNameButtons.forEach((changeNameButton) => {
        changeNameButton.addEventListener('click', () => {
          const friendBox = changeNameButton.closest('.friend-Box');
          const friendName = friendBox.querySelector('.friend-name');
          const friendNameInput = friendBox.querySelector('.friend-name-input');
          const applyButton = friendBox.querySelector(
            '.friend-change-name-button[id^="friend-change-button"]'
          );
          const changeButton = event.target
            .closest('.friend-Box')
            .querySelector('.friend-change-name');

          let name;

          friendNameInput.style.display = 'block';
          friendNameInput.value = friendName.innerHTML;
          friendName.style.display = 'none';
          applyButton.style.display = 'block';
          changeButton.style.display = 'none';
          name = friendName.innerHTML;

          // 入力値が変更された時の処理
          friendNameInput.addEventListener('input', () => {
            name = friendNameInput.value;
          });

          //名前変更の[適用]ボタン押下
          applyButton.addEventListener('click', () => {
            const buttonId = applyButton.getAttribute('id');
            const id = buttonId.match(/\d+/)[0];
            friendNameInput.value = name;

            $.ajax({
              url: '/mypage/' + hashedIdGet,
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                flg: 'friend-list-name-change',
                id,
                name,
              }),
              success: function (res) {
                friendNameInput.style.display = 'none';
                applyButton.style.display = 'none';
                friendName.style.display = 'block';
                friendName.innerHTML = name;
                changeButton.style.display = 'block';
              },
            });
          });
        });
      });

      //グループリスト出力
      $.ajax({
        url: '/mypage/' + hashedIdGet,
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'group_get',
        }),
        success: function (res) {
          console.log(res.groupResults);
        },
      });
    },
  });
});

document
  .getElementById('pop-delete_friend-delete-q')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_friend-delete-q').style.display =
      'none';
  });

document
  .getElementById('friend-delete-q-button')
  .addEventListener('click', (e) => {
    friendListDelete(
      document.getElementById('friend-delete-q-user').textContent
    );
  });

document
  .getElementById('friend-delete-q-cancel')
  .addEventListener('click', (e) => {
    document.getElementById('popup-overlay_friend-delete-q').style.display =
      'none';
  });

const friendListDelete = (name) => {
  document.getElementById('popup-overlay_friend-delete-q').style.display =
    'none';
  document.getElementById('popup-overlay_friend-delete-ans').style.display =
    'block';
  setTimeout(() => {
    document.getElementById('popup-overlay_friend-delete-ans').style.display =
      'none';
  }, 1500);

  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'friend-list-delete',
      name,
    }),
    success: function (res) {
      friendListUpdate();
    },
  });
};

document
  .getElementById('pop-delete_friend-list')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_friend-list').style.display = 'none';
  });

document
  .getElementById('popup-overlay_friend-list')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_friend-list');
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

//フレンド追加のポップアップ出力
document
  .getElementById('friend-list-add-button')
  .addEventListener('click', () => {
    document.getElementById('popup-overlay_friend-add').style.display = 'block';
  });

document
  .getElementById('pop-delete_friend-add')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_friend-add').style.display = 'none';
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

      // loader以外（タブの要素のみ）を削除させる
      const tabLoader = document.getElementById('tab_loader');
      const tabWrap = document.getElementById('tab');
      while (tabWrap.firstChild !== tabLoader) {
        tabWrap.removeChild(tabWrap.firstChild);
      }
      while (tabWrap.lastChild !== tabLoader) {
        tabWrap.removeChild(tabWrap.lastChild);
      }

      let p = document.createElement('p');
      p.setAttribute('id', 'notab');
      p.innerHTML = 'こちらにノウハウが出力されます';
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
  document.querySelector('.cube3').classList.add(`cube3-${color}`);
  document.querySelector('.cube4').classList.add(`cube4-${color}`);
  document.querySelector('.cube5').classList.add(`cube5-${color}`);
  document.querySelector('.cube6').classList.add(`cube6-${color}`);

  const files = document.querySelectorAll('.file');
  if (files !== null) {
    files.forEach((file) => {
      file.classList.add(`file-${color}`);
    });
  }
  const folders = document.querySelectorAll('.folder');
  if (folders !== null) {
    folders.forEach((folder) => {
      folder.classList.add(`folder-${color}`);
    });
  }
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

  const files = document.querySelectorAll('.file');
  if (files !== null) {
    files.forEach((file) => {
      file.classList.remove('file-red');
      file.classList.remove('file-yellow');
      file.classList.remove('file-blue');
      file.classList.remove('file-green');
      file.classList.remove('file-purple');
      file.classList.remove('file-orange');
      file.classList.remove('file-gray');
    });
  }

  const folders = document.querySelectorAll('.folder');
  if (folders !== null) {
    folders.forEach((folder) => {
      folder.classList.remove('folder-red');
      folder.classList.remove('folder-yellow');
      folder.classList.remove('folder-blue');
      folder.classList.remove('folder-green');
      folder.classList.remove('folder-purple');
      folder.classList.remove('folder-orange');
      folder.classList.remove('folder-gray');
    });
  }

  const cube1 = document.querySelector('.cube1');
  cube1.classList.remove(`cube1-red`);
  cube1.classList.remove(`cube1-yellow`);
  cube1.classList.remove(`cube1-blue`);
  cube1.classList.remove(`cube1-green`);
  cube1.classList.remove(`cube1-purple`);
  cube1.classList.remove(`cube1-orange`);
  cube1.classList.remove(`cube1-gray`);

  const cube2 = document.querySelector('.cube2');
  cube2.classList.remove(`cube2-red`);
  cube2.classList.remove(`cube2-yellow`);
  cube2.classList.remove(`cube2-blue`);
  cube2.classList.remove(`cube2-green`);
  cube2.classList.remove(`cube2-purple`);
  cube2.classList.remove(`cube2-orange`);
  cube2.classList.remove(`cube2-gray`);

  const cube3 = document.querySelector('.cube3');
  cube3.classList.remove(`cube3-red`);
  cube3.classList.remove(`cube3-yellow`);
  cube3.classList.remove(`cube3-blue`);
  cube3.classList.remove(`cube3-green`);
  cube3.classList.remove(`cube3-purple`);
  cube3.classList.remove(`cube3-orange`);
  cube3.classList.remove(`cube3-gray`);

  const cube4 = document.querySelector('.cube4');
  cube4.classList.remove(`cube4-red`);
  cube4.classList.remove(`cube4-yellow`);
  cube4.classList.remove(`cube4-blue`);
  cube4.classList.remove(`cube4-green`);
  cube4.classList.remove(`cube4-purple`);
  cube4.classList.remove(`cube4-orange`);
  cube4.classList.remove(`cube4-gray`);

  const cube5 = document.querySelector('.cube5');
  cube5.classList.remove(`cube5-red`);
  cube5.classList.remove(`cube5-yellow`);
  cube5.classList.remove(`cube5-blue`);
  cube5.classList.remove(`cube5-green`);
  cube5.classList.remove(`cube5-purple`);
  cube5.classList.remove(`cube5-orange`);
  cube5.classList.remove(`cube5-gray`);

  const cube6 = document.querySelector('.cube6');
  cube6.classList.remove(`cube6-red`);
  cube6.classList.remove(`cube6-yellow`);
  cube6.classList.remove(`cube6-blue`);
  cube6.classList.remove(`cube6-green`);
  cube6.classList.remove(`cube6-purple`);
  cube6.classList.remove(`cube6-orange`);
  cube6.classList.remove(`cube6-gray`);

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

//フレンド追加の検索ボタン押下時、
document
  .getElementById('friend-search-button')
  .addEventListener('click', () => {
    const time = currentTimeGet();
    $.ajax({
      url: '/mypage/' + hashedIdGet,
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'Authentication_ID',
        Authentication_ID: document.getElementById('idInput').value,
        time,
      }),
      success: function (res) {
        if (res.msg === 'NG') {
          alert('その利用者IDのユーザーは存在しません');
        } else if (res.msg === 'already') {
          alert(`${res.userName}さんは既に追加済みです`);
        } else {
          friendListUpdate();
          document.getElementById('popup-overlay_friend-add').style.display =
            'none';
          document.getElementById(
            'popup-overlay_friend-add-ans'
          ).style.display = 'block';
          document.getElementById('new-friend-user').innerHTML = res.userName;

          document
            .getElementById('popup-overlay_friend-add-ans')
            .addEventListener('click', (e) => {
              const popup = document.getElementById(
                'popup-overlay_friend-add-ans'
              );
              if (e.target === popup) {
                popup.style.display = 'none';
              }
            });

          setTimeout(() => {
            document.getElementById(
              'popup-overlay_friend-add-ans'
            ).style.display = 'none';
          }, 1500);
        }
      },
    });
  });

//フレンドリストのフレンド表示を更新
const friendListUpdate = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/mypage/' + hashedIdGet,
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'friend-list-get',
      }),
      success: function (res) {
        const friendListDiv = document.getElementById('friend-list-div');
        friendListDiv.innerHTML = '';

        if (res.friend.length === 0) {
          friendListDiv.innerHTML = '※フレンドが登録されていません';
          resolve(); // 処理が完了したことを知らせるだけなのでresolve()を呼び出す
        }

        let promises = [];

        res.friend.forEach((friend) => {
          const friendElement = document.createElement('div');
          friendElement.setAttribute('class', 'friend-Box');
          friendElement.setAttribute('id', `friend-Box${friend.id}`);
          const friendRow = document.createElement('div');
          friendRow.setAttribute('class', 'friend-row');
          const div1 = document.createElement('div');
          div1.setAttribute('class', 'friend-name-div');
          const p1 = document.createElement('p');
          p1.setAttribute('class', 'friend-name');
          p1.innerHTML = friend.Changed_Name;
          const groupDiv = document.createElement('div');
          groupDiv.setAttribute('class', 'group-name-div');
          const groupP = document.createElement('p');
          groupP.setAttribute('class', 'group-name-p');
          groupP.innerHTML = 'グループ：';
          const span = document.createElement('span');
          span.setAttribute('class', `group-name-span`);
          span.innerHTML = friend.User_Group;
          const groupButton = document.createElement('button');
          groupButton.setAttribute('class', 'group-name-change-button');
          groupButton.setAttribute(
            'id',
            `group-name-change-button${friend.id}`
          );
          groupButton.innerHTML = '変更';
          const p2 = document.createElement('p');
          p2.setAttribute('class', 'friend-login');
          p2.innerHTML = '最終ログイン日時: ';
          const div = document.createElement('div');
          div.setAttribute('class', 'input-wrapper');
          const input = document.createElement('input');
          input.setAttribute('class', `friend-name-input`);
          input.setAttribute('id', `friend-name-input${friend.id}`);
          input.style.display = 'none';
          const button = document.createElement('button');
          button.setAttribute('class', 'friend-change-name-button');
          button.setAttribute('id', `friend-change-button${friend.id}`);
          button.innerHTML = '適用';
          button.style.display = 'none';
          const button1 = document.createElement('button');
          button1.setAttribute('class', 'friend-change-name');
          button1.innerHTML = '変更';
          const button2 = document.createElement('button');
          button2.setAttribute('class', 'friend-delete');
          button2.innerHTML = '×';

          div1.appendChild(p1);
          div1.appendChild(input);
          friendRow.appendChild(div1);

          div.appendChild(button);
          div.appendChild(button1);
          div.appendChild(button2);
          friendRow.appendChild(div);

          friendElement.appendChild(friendRow);

          groupP.appendChild(span);
          groupDiv.appendChild(groupP);
          groupDiv.appendChild(groupButton);

          friendElement.appendChild(groupDiv);
          friendElement.appendChild(p2);
          friendListDiv.appendChild(friendElement);

          const promise = new Promise((resolve, reject) => {
            $.ajax({
              url: '/notePostController/',
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                flg: 'info_name',
                name: friend.user_name,
              }),
              success: function (res) {
                p2.innerHTML = '最終ログイン日時: ' + res.fileResult.LoginDate;
                resolve();
              },
            });
          });

          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          resolve(); // 処理が完了したことを知らせるためにresolve()を呼び出す
        });
      },
    });
  });
};

document
  .getElementById('friend-list-group-add-button')
  .addEventListener('click', openGroupAddPopup);

document
  .getElementById('pop-delete_group-add')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_group-add').style.display = 'none';
    document
      .getElementById('group-add-button')
      .removeEventListener('click', addGroup);
  });

function openGroupAddPopup() {
  document.getElementById('popup-overlay_group-add').style.display = 'block';
  groupListUpdate('group-display');

  document
    .getElementById('group-add-button')
    .addEventListener('click', addGroup);
}

//DBにグループを追加後、グループリスト画面更新
function addGroup() {
  const groupName = document.getElementById('group-Name-input').value;
  document.getElementById('group-Name-input').value = '';
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'group_add',
      groupName,
    }),
    success: function (res) {
      groupListUpdate('group-display');
    },
  });
}

//グループリスト画面を更新（三列に表示する）
const groupListUpdate = (idElement) => {
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'group_get',
    }),
    success: function (res) {
      const groupDisplay = document.getElementById(idElement);
      groupDisplay.innerHTML = '';

      res.groupResults.forEach((item) => {
        const userGroup = item['User_Group'].trim();

        let column = document.createElement('div');
        column.classList.add('column');
        column.innerHTML = `<div class="column-inner">${userGroup}</div>`;
        groupDisplay.appendChild(column);
      });
    },
  });
};

//共有履歴のドロップダウンリストの判定(td要素のdata-share-status属性で判定)
function shareHistoryTableDownList() {
  const filterSelect = document.getElementById('filter-select');
  const shareTable = document.getElementById('share-history-table');

  filterSelect.addEventListener('change', function () {
    const selectedValue = filterSelect.value;
    const tableRows = shareTable.getElementsByTagName('tr');

    for (let i = 1; i < tableRows.length; i++) {
      const shareStatusCell = tableRows[i].querySelector('[data-share-status]');
      const shareStatus = shareStatusCell.getAttribute('data-share-status');

      if (
        !shareStatusCell ||
        selectedValue === '' ||
        shareStatus === selectedValue
      ) {
        tableRows[i].style.display = '';
      } else {
        tableRows[i].style.display = 'none';
      }
    }
  });
}

let isDateSorted = false;
let isUserSorted = false;
let ascSortOrder = true; // 初期値は昇順

//共有履歴の日付を降順/昇順にする
function sortTableByDate() {
  const table = document.getElementById('share-history-table');
  const rows = Array.from(table.getElementsByTagName('tr')).slice(1);

  rows.sort(function (a, b) {
    const dateA = new Date(getFormattedDate(a.cells[1].textContent));
    const dateB = new Date(getFormattedDate(b.cells[1].textContent));

    if (isDateSorted) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  isDateSorted = !isDateSorted;

  rows.forEach(function (row) {
    table.appendChild(row);
  });

  // ソートアイコンの表示切り替え
  ascSortOrder = !ascSortOrder; // 昇順と降順を切り替え
  if (ascSortOrder) {
    document.getElementById('dateSortIndicator').textContent = '▲'; // 昇順アイコン
  } else {
    document.getElementById('dateSortIndicator').textContent = '▼'; // 降順アイコン
  }
}

//共有履歴のユーザーを降順/昇順にする
function sortTableByUser() {
  const table = document.getElementById('share-history-table');
  const rows = Array.from(table.getElementsByTagName('tr')).slice(1);

  rows.sort(function (a, b) {
    const userA = a.cells[2].textContent.toLowerCase();
    const userB = b.cells[2].textContent.toLowerCase();

    if (isUserSorted) {
      return userA.localeCompare(userB);
    } else {
      return userB.localeCompare(userA);
    }
  });

  isUserSorted = !isUserSorted;

  rows.forEach(function (row) {
    table.appendChild(row);
  });

  // ソートアイコンの表示切り替え
  ascSortOrder = !ascSortOrder; // 昇順と降順を切り替え
  if (ascSortOrder) {
    document.getElementById('userSortIndicator').textContent = '▲'; // 昇順アイコン
  } else {
    document.getElementById('userSortIndicator').textContent = '▼'; // 降順アイコン
  }
}

function getFormattedDate(dateString) {
  const [year, month, day, hour, minute] = dateString.split(/[-年月日:]/);
  return `${month}/${day}/${year} ${hour}:${minute}`;
}

function groupCheckListScreen(button) {
  // console.log(button);
  // console.log(button.id);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/mypage/' + hashedIdGet,
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'group_get',
      }),
      success: function (res) {
        document.getElementById('all-group-list').innerHTML = '';

        res.groupResults.forEach((group) => {
          const div = document.createElement('div');
          div.setAttribute('class', `group-list-check-div`);

          // チェックボックス要素の作成
          const checkbox = document.createElement('input');
          checkbox.type = 'radio';
          checkbox.id = `checkbox-group${group.User_Group}`;
          checkbox.name = 'group';

          // ラベル要素の作成
          const checkboxLabel = document.createElement('label');
          checkboxLabel.textContent = group.User_Group;
          checkboxLabel.setAttribute(
            'for',
            `checkbox-group${group.User_Group}`
          );

          // 要素の追加
          document.getElementById('all-group-list').appendChild(div);
          div.appendChild(checkbox);
          div.appendChild(checkboxLabel);
        });
        const button = document.createElement('button');
        button.setAttribute('id', 'group-list-decision-button');
        button.innerHTML = '適用';
        document.getElementById('all-group-list').appendChild(button);
        resolve();
      },
    });
  });
}
