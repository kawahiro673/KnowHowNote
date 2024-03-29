//MENUのフレンドリスト → グループリスト等の実装
import { hashedIdGet } from '../main.js';
import { friendListUpdate } from './friend-list.js';
import { resultPopUp, answerPopUp, explanationPopUp } from '../stringUtils.js';

export const openGroupAddPopup = () => {
  document.getElementById('popup-overlay_group-add').style.display = 'block';
  groupListUpdate('group-display');

  document
    .getElementById('group-add-button')
    .addEventListener('click', addGroup);
};

export const addGroup = () => {
  const groupName = document.getElementById('group-Name-input').value;
  if (groupName !== '') {
    $.ajax({
      url: '/groupListPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'group_get',
      }),
      success: function (res) {
        const groupExistFlg = res.groupResults.find(
          (result) => result.User_Group === groupName
        );
        if (groupExistFlg) {
          explanationPopUp(
            'グループ登録',
            'そのグループ名は既に登録されています'
          );
          return;
        } else if (groupName === 'なし') {
          explanationPopUp(
            'グループ登録',
            'グループ名「なし」は作成することができません'
          );
          return;
        }

        document.getElementById('group-Name-input').value = '';
        $.ajax({
          url: '/groupListPostController/',
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
      },
    });
  } else {
    explanationPopUp('グループ登録', '登録したいグループ名を入力してください');
  }
};

//グループリスト画面を更新
const groupListUpdate = (idElement) => {
  $.ajax({
    url: '/groupListPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'group_get',
    }),
    success: function (res) {
      const groupDisplay = document.getElementById(idElement);
      const popupGroupMember = document.getElementById('popup-group-member');
      let timer;
      let isPopupShown = false;
      groupDisplay.innerHTML = '';

      if (res.groupResults.length === 0) {
        document.getElementById('group-add-list-massage').innerHTML =
          '※グループは作成されていません';
      } else {
        document.getElementById('group-add-list-massage').innerHTML =
          '※現在作成されているグループになります';
        res.groupResults.forEach((item) => {
          const userGroup = item['User_Group'].trim();

          let column = document.createElement('div');
          column.classList.add('column');
          column.innerHTML = `<div class="column-inner">${userGroup}</div>`;

          const groupDelete = document.createElement('button');
          groupDelete.setAttribute('class', 'group-delete');
          groupDelete.addEventListener('click', groupDeleteButton);
          groupDelete.innerHTML = '×';

          groupDisplay.appendChild(column);
          column.appendChild(groupDelete);

          column.addEventListener('mouseenter', (event) => {
            if (!isPopupShown) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                popupGroupMember.style.display = 'block';

                popupGroupMember.style.left = event.clientX + 'px';
                popupGroupMember.style.top = event.clientY + 'px';

                //ここでajax処理
                $.ajax({
                  url: '/groupListPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'group_info',
                    group: userGroup,
                  }),
                  success: function (res) {
                    document.getElementById(
                      'group-member-groupname'
                    ).innerHTML = userGroup;
                    const memberList =
                      document.getElementsByClassName('group-member-list')[0];
                    memberList.innerHTML = '';
                    res.friendResult.forEach((friend) => {
                      const p = document.createElement('p');
                      p.setAttribute('class', `group-member`);
                      p.innerHTML = friend.Changed_Name;
                      memberList.appendChild(p);
                    });
                    if (
                      document.getElementsByClassName('group-member-list')[0]
                        .innerHTML === ''
                    ) {
                      const p = document.createElement('p');
                      p.setAttribute('class', `group-member-none`);
                      p.innerHTML = `${userGroup}に所属しているフレンドが見つかりません`;
                      memberList.appendChild(p);
                    }
                  },
                });

                isPopupShown = true;
              }, 250);
            }
          });
          column.addEventListener('mouseleave', () => {
            clearTimeout(timer);
            popupGroupMember.style.display = 'none';
            isPopupShown = false;
          });
        });
        groupListHoverRedFunc();
      }
    },
  });
};

//共有履歴のドロップダウンリストの判定(td要素のdata-share-status属性で判定)
export const shareHistoryTableDownList = () => {
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
};

//グループのチェックリスト画面を作成
const groupCheckListScreen = (button) => {
  const id = parseInt(button.id.match(/\d+/)[0]);
  const groupName = document.getElementById(`group-name-span${id}`).innerHTML;

  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/groupListPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'group_get',
      }),
      success: function (res) {
        //表示前に削除
        document.getElementById('all-group-list').innerHTML = '';
        const element = document.querySelector('.group-list-check-button-div');
        if (element) {
          element.parentNode.removeChild(element);
        }
        //グループ「なし」のチェックボックス作成
        const div_nashi = document.createElement('div');
        div_nashi.setAttribute('class', `group-list-check-div`);

        const checkbox_nashi = document.createElement('input');
        checkbox_nashi.type = 'radio';
        checkbox_nashi.id = `checkbox-groupなし`;
        checkbox_nashi.name = 'group';

        // ラベル要素の作成
        const checkboxLabel_nashi = document.createElement('label');
        checkboxLabel_nashi.textContent = 'なし';
        checkboxLabel_nashi.setAttribute('for', `checkbox-groupなし`);

        // 要素の追加
        document.getElementById('all-group-list').appendChild(div_nashi);
        div_nashi.appendChild(checkbox_nashi);
        div_nashi.appendChild(checkboxLabel_nashi);

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

          if (groupName === group.User_Group) checkbox.checked = true;
        });
        const button = document.createElement('button');
        const buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('class', `group-list-check-button-div`);
        button.setAttribute('id', 'group-list-decision-button');
        button.innerHTML = '適用';

        document
          .getElementsByClassName('popup-body_group-list')[0]
          .appendChild(buttonDiv);
        buttonDiv.appendChild(button);
        resolve();
      },
    });
  });
};

//グループリストからグループ削除
const groupDeleteButton = async (event) => {
  const group = event.target
    .closest('.column')
    .querySelector('.column-inner').innerHTML;

  const result = await answerPopUp(
    'グループ追加',
    `"${group}"へ所属しているユーザーのグループが解除されます<br>削除してもよろしいですか？`
  );
  if (result === true) {
    $.ajax({
      url: '/groupListPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'group_delete',
        group,
      }),
      success: function (res) {
        resultPopUp('グループ削除', '削除しました');
        groupListUpdate('group-display');
        friendListUpdate();
      },
    });
  }
};

//フレンドリスト内の、グループのみの更新
export const friendListGroupUpdate = () => {
  $.ajax({
    url: '/friendListPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'friend-list-get',
    }),
    success: function (res) {
      let elements = document.getElementsByClassName('group-name-span');

      for (let i = 0; i < elements.length; i++) {
        const idNumber = elements[i].id.replace('group-name-span', ''); // idから数値部分を抽出
        // res.friendの中からidが一致するオブジェクトを探す
        const matchingGroup = res.friend.find(
          (group) => group.id === Number(idNumber)
        );

        if (matchingGroup) {
          elements[i].innerHTML = matchingGroup.User_Group; // 一致した場合はinnerHTMLに値を代入
        }
      }
    },
  });
};

export async function friendListGroupChange(event) {
  event.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_group-list').style.display = 'block';
  await groupCheckListScreen(event.target);
  const id = event.target.id.match(/\d+/)[0];

  // ボタンのクリックイベントリスナー内で処理を行う
  const decisionButton = document.getElementById('group-list-decision-button');
  decisionButton.addEventListener('click', () => {
    let extracted;
    const checkboxes = document.querySelectorAll(
      '.group-list-check-div input[type="radio"]'
    );
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        extracted = checkboxes[i].id.replace('checkbox-group', '');
      }
    }
    $.ajax({
      url: '/groupListPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'group_update',
        id,
        group: extracted,
      }),
      success: function (res) {
        document.getElementById('popup-overlay_group-list').style.display =
          'none';
        friendListGroupUpdate();
      },
    });
  });
}

//ホバーの際に赤文字
function groupListHoverRedFunc() {
  const groupDeletes = document.querySelectorAll('.group-delete');
  const columnInners = document.querySelectorAll('.column-inner');

  groupDeletes.forEach((groupDelete, index) => {
    groupDelete.addEventListener('mouseover', () => {
      groupDelete.style.color = 'red';
      columnInners[index].style.color = 'red';
    });

    groupDelete.addEventListener('mouseout', () => {
      groupDelete.style.color = ''; // デフォルトの色に戻す
      columnInners[index].style.color = ''; // デフォルトの色に戻す
    });
  });
}
