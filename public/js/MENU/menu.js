//MENUボタンの主な機能を実装

import { hashedIdGet } from '../main.js';
import {
  currentTimeGet,
  resultPopUp,
  validateEmail,
  answerPopUp,
  explanationPopUp,
  validatePassword,
} from '../stringUtils.js';
import { friendListUpdate } from './friend-list.js';
import {
  openGroupAddPopup,
  addGroup,
  shareHistoryTableDownList,
} from './group-list.js';
import { backgroundColorCheckBoxOption } from './my-profile.js';
import { sortTableByUser, sortTableByDate } from './share-history.js';

const menuCheckbox = document.getElementById('tg');
const menuLabel = document.querySelector('.dropLabel');

// ドキュメント全体でクリックイベントを監視
document.addEventListener('click', function (event) {
  // MENU 以外をクリックした場合、ドロップダウンメニューを閉じる
  if (
    !menuLabel.contains(event.target) &&
    !menuCheckbox.contains(event.target)
  ) {
    menuCheckbox.checked = false;
  }
});

// MENU ラベルのクリックイベントを無効化して、ドロップダウンメニューを閉じる・開く
menuLabel.addEventListener('click', function (event) {
  event.preventDefault();
  menuCheckbox.checked = !menuCheckbox.checked;
});

//=============================================================================================================
//====================================================個別設定=================================================
//=============================================================================================================

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
      document.getElementById('my-mail').innerHTML = res.user.Email;
      const date = new Date(res.user.CreationDay);
      document.getElementById('RegistrationDate').innerHTML =
        res.user.CreationDay;
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

//チェックボックスへチェック後、他のチェックを外す(falseへ)
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

//共有機能をON/OFF設定画面
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

//各ユーザーが設定している共有機能のON・OFFを取得する
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

document
  .getElementById('change-email-button')
  .addEventListener('click', (e) => {
    document.getElementById('change-email-input').style.display = 'block';
    document.getElementById('change-email-input').value =
      document.getElementById('my-mail').innerHTML;
    document.getElementById('my-mail').style.display = 'none';
    document.getElementById('change-email-button').style.display = 'none';
    document.getElementById('change-email-button-decision').style.display =
      'block';
  });

document
  .getElementById('change-email-button-decision')
  .addEventListener('click', (e) => {
    const email = document.getElementById('change-email-input').value;
    const flg = validateEmail(email);
    if (flg) {
      $.ajax({
        url: '/mypage/' + hashedIdGet,
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'EmailUpdte',
          email,
        }),
        success: function (res) {
          //alert(res.msg);
          document.getElementById('change-email-input').style.display = 'none';
          document.getElementById('my-mail').style.display = 'block';
          document.getElementById('my-mail').innerHTML = email;
          document.getElementById(
            'change-email-button-decision'
          ).style.display = 'none';
          document.getElementById('change-email-button').style.display =
            'block';
          resultPopUp('メールアドレス 変更', '変更しました');
        },
      });
    } else {
      resultPopUp(
        'メールアドレス変更',
        '正しいメールアドレスが入力されていません'
      );
    }
  });

document
  .getElementById('update-authenticationID-button')
  .addEventListener('click', async (e) => {
    const result = await answerPopUp(
      '利用者ID変更',
      '利用者IDを変更しますが、よろしいですか'
    );
    if (result === true) {
      console.log('更新押下');
      $.ajax({
        url: '/mypage/' + hashedIdGet,
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'AuthenticationIDUpdte',
        }),
        success: function (res) {
          document.getElementById('authentication-ID').innerHTML =
            res.authenticationID;
          resultPopUp('利用者ID 変更', '変更しました');
        },
      });
    }
  });

//パスワード変更ボタン押下時
document
  .getElementById('change-password-button')
  .addEventListener('click', async (e) => {
    const div1 = document.createElement('div');
    div1.className = 'password-inputs';
    const div2 = document.createElement('div');
    div2.className = 'password-inputs';
    const div3 = document.createElement('div');
    div3.className = 'password-inputs';

    const label1 = document.createElement('label');
    label1.innerHTML = '現在のパスワード';
    label1.setAttribute('for', 'current-password-input');
    const currentPasswordInput = document.createElement('input');
    currentPasswordInput.id = 'current-password-input';
    currentPasswordInput.placeholder = '現在のパスワード';

    const label2 = document.createElement('label');
    label2.innerHTML = '新しいパスワード';
    label2.setAttribute('for', 'change-password-input');
    const changePasswordInput = document.createElement('input');
    changePasswordInput.id = 'change-password-input';
    changePasswordInput.placeholder = '8文字以上の半角英数字';

    const label3 = document.createElement('label');
    label3.innerHTML = '新しいパスワード';
    label3.setAttribute('for', 'again-password-input');
    const againPasswordInput = document.createElement('input');
    againPasswordInput.id = 'again-password-input';
    againPasswordInput.placeholder = 'パスワードを再入力';

    div1.appendChild(label1);
    div1.appendChild(currentPasswordInput);
    div2.appendChild(label2);
    div2.appendChild(changePasswordInput);
    div3.appendChild(label3);
    div3.appendChild(againPasswordInput);

    document
      .getElementById('change-password-button')
      .parentNode.insertBefore(
        div1,
        document.getElementById('change-password-button')
      );
    document
      .getElementById('change-password-button')
      .parentNode.insertBefore(
        div2,
        document.getElementById('change-password-button')
      );

    document
      .getElementById('change-password-button')
      .parentNode.insertBefore(
        div3,
        document.getElementById('change-password-button')
      );

    document.getElementById('change-password-button').style.display = 'none';
    document.getElementById('my-password').style.display = 'none';
    document.getElementById('change-password-button-cancel').style.display =
      'inline-block';
    document.getElementById('change-password-button-decision').style.display =
      'inline-block';

    document.getElementById('password-container').removeAttribute('id');
  });

//パスワード変更のキャンセルボタン押下時
document
  .getElementById('change-password-button-cancel')
  .addEventListener('click', async (e) => {
    const passwordInputsContainers =
      document.querySelectorAll('.password-inputs');
    passwordInputsContainers.forEach((container) => {
      container.remove();
    });

    document.getElementById('change-password-button').style.display = 'block';
    document.getElementById('my-password').style.display = 'block';
    document.getElementById('change-password-button-cancel').style.display =
      'none';
    document.getElementById('change-password-button-decision').style.display =
      'none';
    document
      .getElementById('my-password')
      .parentNode.setAttribute('id', 'password-container');
  });

//パスワード変更の適用ボタン押下時
document
  .getElementById('change-password-button-decision')
  .addEventListener('click', async (e) => {
    e.preventDefault();

    if (
      document.getElementById('current-password-input').value === '' ||
      document.getElementById('change-password-input').value === '' ||
      document.getElementById('again-password-input').value === ''
    ) {
      explanationPopUp('パスワード変更', '入力されていない情報があります');
      return false;
    }

    // パスワードの文字数(8文字以上20文字以内)と英数字チェック
    if (
      !validatePassword(document.getElementById('change-password-input').value)
    ) {
      explanationPopUp(
        'パスワード変更',
        'パスワードは8文字以上20文字以下の半角英数字を使用してください'
      );
      return false;
    }

    //確認用パスワード入力チェック
    if (
      document.getElementById('change-password-input').value !==
      document.getElementById('again-password-input').value
    ) {
      explanationPopUp('パスワード変更', 'パスワードの入力に誤りがあります');
      return false;
    }

    $.ajax({
      url: '/mypage/' + hashedIdGet,
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'PassCheck',
        password: document.getElementById('current-password-input').value,
        newPassword: document.getElementById('change-password-input').value,
      }),
      success: function (res) {
        if (!res.isMatch) {
          explanationPopUp('パスワード変更', '現在のパスワードが違います');
          return false;
        }

        const passwordInputsContainers =
          document.querySelectorAll('.password-inputs');
        passwordInputsContainers.forEach((container) => {
          container.remove();
        });

        document.getElementById('change-password-button').style.display =
          'block';
        document.getElementById('my-password').style.display = 'block';
        document.getElementById('change-password-button-cancel').style.display =
          'none';
        document.getElementById(
          'change-password-button-decision'
        ).style.display = 'none';
        document
          .getElementById('my-password')
          .parentNode.setAttribute('id', 'password-container');
        explanationPopUp(
          'パスワード変更',
          'パスワードの変更が完了しました\nパスワードはログインするときに必要となります\n忘れることのないようどこかに控えておいてください'
        );
      },
    });
  });

//=============================================================================================================
//=================================================共有履歴====================================================
//=============================================================================================================
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
      if (res.shareResult === null) {
        document.getElementById('share-history-h1').innerHTML =
          '※共有履歴がありません';
      } else {
        const shareHistoryTable = document.getElementById(
          'share-history-table'
        );
        if (shareHistoryTable) {
          shareHistoryTable.parentNode.removeChild(shareHistoryTable);
        }
        //履歴が未作成の時(連続で押下するたびに作成されるため)
        if (
          !(
            document
              .getElementById('share-history-list')
              .getElementsByTagName('p').length > 0
          )
        ) {
          document.getElementById('share-history-h1').innerHTML =
            '※直近100件まで表示します';
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
          header2.textContent = 'ユーザー/グループ';
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
              img.src = '../img/share-to-be_2.png';
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
  });

document
  .getElementById('popup-overlay_share-history')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_share-history');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

//=============================================================================================================
//================================================使い方=======================================================
//=============================================================================================================
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

//=============================================================================================================
//=================================================このサイトについて==========================================
//=============================================================================================================
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

//=============================================================================================================
//==================================================フレンドリスト==============================================
//=============================================================================================================
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
    },
  });
});

document
  .getElementById('popup-overlay_friend-list')
  .addEventListener('click', (e) => {
    const popup = document.getElementById('popup-overlay_friend-list');
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

document
  .getElementById('pop-delete_friend-list')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_friend-list').style.display = 'none';
  });

//フレンド追加のポップアップ出力
document
  .getElementById('friend-list-add-button')
  .addEventListener('click', () => {
    document.getElementById('popup-overlay_friend-add').style.display = 'block';
    document.getElementById('idInput').value = '';
  });

document
  .getElementById('pop-delete_friend-add')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_friend-add').style.display = 'none';
  });

//フレンドリスト＞フレンド追加　ポップアップの[適用]ボタン押下時
document
  .getElementById('friend-search-button')
  .addEventListener('click', () => {
    if (
      document.getElementById('idInput').value ===
      document.getElementById('myID').innerHTML
    ) {
      alert('自分自身はフレンドリストに登録できません');
    } else if (document.getElementById('idInput').value === '') {
      alert('フレンドリストに追加したい利用者IDを入力してください');
    } else {
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
            resultPopUp(
              'フレンド追加',
              `"${res.userName}"さんをフレンドリストに追加しました`
            );
          }
        },
      });
    }
  });

//=============================================================================================================
//==============================================グループリスト=================================================
//=============================================================================================================
document
  .getElementById('pop-delete_group-list')
  .addEventListener('click', function (event) {
    event.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_group-list').style.display = 'none';
  });

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

//=============================================================================================================
//==============================================問い合わせ=====================================================
//=============================================================================================================
document.getElementById('inquiry').addEventListener('click', () => {
  document.getElementById('popup-overlay_inquiry').style.display = 'block';
});

document.getElementById('pop-delete_inquiry').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_inquiry').style.display = 'none';
});

document.getElementById('inquiry-button').addEventListener('click', () => {
  if (document.getElementById('inquiry-content').value !== '') {
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
        resultPopUp('問い合わせ', '受け付けました');
      },
    });
  } else {
    alert('問い合わせ内容を記載してください');
  }
});

//=============================================================================================================
//================================================ログアウト====================================================
//=============================================================================================================

document.getElementById('logout').addEventListener('click', async function () {
  const result = await answerPopUp(
    'ログアウト',
    'ログアウトしますか？※編集中のノウハウは保存されません'
  );
  if (result === true) {
    $.ajax({
      url: '/mypage/' + hashedIdGet,
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'cookiedelete',
      }),
      success: function (res) {
        resultPopUp('ログアウト', 'ログアウト中です\n少々お待ちください');
        location.href = 'https://nodejs-itnote-app.herokuapp.com';
      },
    });
  } else {
    // 「いいえ」が押された場合の処理 おそらくポップが閉じる
  }
});

//=============================================================================================================
//==================================================全削除====================================================
//=============================================================================================================
document
  .getElementById('all-delete')
  .addEventListener('click', async function () {
    const result = await answerPopUp(
      '全削除',
      'ノートやフォルダが全て削除されますが本当に削除しますか？'
    );
    if (result === true) {
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
          document.getElementById('popup-overlay_delete').style.display =
            'none';

          resultPopUp('全削除', 'ノウハウ/フォルダを\nすべて削除いたしました');
        },
      });
    } else {
      // 「いいえ」が押された場合の処理 おそらくポップが閉じる
    }
  });
