//MENUボタンのフレンドリストの実装

import { hashedIdGet } from '../main.js';
import { friendListGroupChange } from './group-list.js';
import { resultPopUp } from '../stringUtils.js';

export const friendListDelete = (name) => {
  document.getElementById('popup-overlay_friend-delete-q').style.display =
    'none';
  resultPopUp('フレンド削除', 'フレンドから登録解除しました');

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

//フレンドリストのフレンド表示を更新
export const friendListUpdate = () => {
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
          groupP.innerHTML = 'グループ: ';
          const span = document.createElement('span');
          span.setAttribute('class', `group-name-span`);
          span.setAttribute('id', `group-name-span${friend.id}`);
          span.innerHTML = friend.User_Group;
          const groupButton = document.createElement('button');
          groupButton.setAttribute('class', 'group-name-change-button');
          groupButton.setAttribute(
            'id',
            `group-name-change-button${friend.id}`
          );
          groupButton.innerHTML = '変更';
          groupButton.addEventListener('click', friendListGroupChange);

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
          button1.addEventListener('click', friendListNameChange);
          const button2 = document.createElement('button');
          button2.setAttribute('class', 'friend-delete');
          button2.innerHTML = '×';
          button2.addEventListener('click', friendListDeleteCross);
          const realNamep = document.createElement('p');
          realNamep.setAttribute('class', 'real-name-p');
          realNamep.innerHTML = `(${friend.user_name})`;

          div1.appendChild(p1);
          div1.appendChild(input);
          friendRow.appendChild(div1);

          div.appendChild(button);
          div.appendChild(button1);
          div.appendChild(button2);
          friendRow.appendChild(div);

          friendElement.appendChild(friendRow);

          friendElement.appendChild(realNamep);

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

function friendListDeleteCross(event) {
  const friendName = event.target
    .closest('.friend-Box')
    .querySelector('.friend-name').textContent;
  const friendRealName = event.target
    .closest('.friend-Box')
    .querySelector('.real-name-p').textContent;
  document.getElementById('popup-overlay_friend-delete-q').style.display =
    'block';
  document.getElementById('friend-delete-q-user').innerHTML = friendName;
  document.getElementById('friend-delete-q-real-user').innerHTML =
    friendRealName;
}

function friendListNameChange(event) {
  const changeNameButton = event.target
    .closest('.friend-Box')
    .querySelector('.friend-change-name');
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

    if (name !== '') {
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
    } else {
      alert('ユーザー名を入力してください');
    }
  });
}
