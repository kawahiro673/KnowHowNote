//タブで必要な関数まとめ
import { currentTimeGet, passGet, orderGet } from './stringUtils.js';

export const tabCreate = (id, title, res) => {
  const inputTab = document.createElement('input');
  inputTab.setAttribute('id', 'TAB-ID' + id);
  inputTab.setAttribute('type', 'radio');
  inputTab.setAttribute('name', 'TAB');
  inputTab.setAttribute('class', 'tab-switch');
  inputTab.setAttribute('checked', 'checked');

  const labelTab = document.createElement('label');
  labelTab.setAttribute('class', 'tab-label');
  labelTab.setAttribute('id', 'tab-ID' + id);
  labelTab.setAttribute('for', 'TAB-ID' + id);
  labelTab.style.display = 'block';

  const labelColor = document.createElement('div');
  labelColor.setAttribute('class', 'label-color');
  labelColor.setAttribute('id', 'label-color' + id);

  const tabname = document.createElement('p');
  tabname.setAttribute('class', 'tabname');
  tabname.setAttribute('id', 'tabname' + id);
  tabname.innerHTML = title;

  //[✖️]ボタン作成
  const buttonTab = document.createElement('button');
  buttonTab.setAttribute('class', 'buttonTab');
  buttonTab.setAttribute('id', 'button' + id);
  buttonTab.innerHTML = '×';

  // div要素を生成
  let div = document.createElement('div');
  div.className = 'tab-content';
  div.setAttribute('id', 'Tab-ID' + id);
  div.setAttribute('value', id);
  let div1 = document.createElement('div');
  div1.setAttribute('class', 'title');
  let p = document.createElement('p');
  p.setAttribute('class', 'title-txt');
  p.style.fontSize = '25px';
  p.style.color = 'black';
  p.style.textAlign = 'left';
  p.setAttribute('id', 'tabP' + id);
  let shareButton = document.createElement('button');
  shareButton.setAttribute('class', 'sharebtn');
  shareButton.innerHTML = '共有する';
  let divFade = document.createElement('div');
  let div2 = document.createElement('div');
  div2.setAttribute('class', 'form-group');
  let textarea = document.createElement('textarea');
  textarea.readOnly = true;
  textarea.style.height = '500px';
  let editButton = document.createElement('button');
  editButton.setAttribute('class', 'editbtn');
  editButton.innerHTML = '編集する';
  p.innerHTML = res.title;
  textarea.innerHTML = res.memo_text;
  let fadeFont = document.createElement('p');
  fadeFont.setAttribute('class', 'fade-out-font');
  fadeFont.classList.add('fadeout');
  fadeFont.setAttribute('id', `fade${id}`);
  fadeFont.style.visibility = 'hidden';
  let time = document.createElement('p');
  time.setAttribute('class', 'updatetime');
  time.setAttribute('id', `time${id}`);
  time.style.color = 'black';
  time.innerHTML = res.saved_time;

  //要素追加
  tab.appendChild(inputTab);
  tab.appendChild(labelTab);
  labelTab.appendChild(tabname);
  labelTab.appendChild(buttonTab);
  labelTab.appendChild(labelColor);
  tab.appendChild(div);
  div.appendChild(div1);
  div.appendChild(divFade);
  div.appendChild(div2);
  div1.appendChild(p);
  div1.appendChild(shareButton);
  div2.appendChild(textarea);
  div.appendChild(editButton);
  divFade.appendChild(fadeFont);
  div.appendChild(time);
  tabLabelColorGet(id);

  return [editButton, div, textarea, fadeFont, shareButton, buttonTab];
};

//タブエリアの[保存]ボタン押下時
export const keepButtonClick = (
  id,
  textarea,
  fadeFont,
  keepButton,
  cancelButton,
  editButton,
  newTitle,
  titletext
) => {
  const pass = passGet(id, newTitle);
  const time = currentTimeGet();
  $.ajax({
    url: '/notePostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'noteKeep',
      id,
      titleContent: newTitle, //p.innerHTML,
      memoContent: textarea.value, //ここに入力した値が入る
      time,
    }),
    success: function (res) {
      document.getElementById(`fade${id}`).style.visibility = 'visible';
      //1000ミリ秒後に表示を隠す
      document.getElementById(`fade${id}`).textContent =
        '保存が完了いたしました';

      setTimeout(() => {
        fadeFont.style.visibility = 'hidden';
      }, 1000);
    },
  });
  keepButton.remove();
  cancelButton.remove();
  document.getElementById(`tabP${id}`).innerHTML = newTitle;
  document.getElementById(`tabP${id}`).style.display = 'block';
  document.getElementById(`tabname${id}`).innerHTML = newTitle;
  document.getElementById(`file${id}`).innerHTML = newTitle;
  titletext.remove();
  editButton.style.display = 'block';
  textarea.readOnly = true;
  document.getElementById(`time${id}`).innerHTML = time;
  document.getElementById('notepass').innerHTML = pass;
};

//タブエリアの[取り消し]ボタン押下時
export const cancelButtonClick = (
  id,
  keepButton,
  cancelButton,
  editButton,
  textarea,
  titletext
) => {
  let btn = confirm(
    '本当に編集を取り消しますか？\n保存していないものは取り消されます。'
  );
  if (btn) {
    $.ajax({
      url: '/notePostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'info',
        id,
      }),
      success: function (res) {
        textarea.value = res.fileResult.memo_text;
      },
    });
    document.getElementById(`tabP${id}`).style.display = 'block';
    keepButton.remove();
    cancelButton.remove();
    titletext.remove();
    editButton.style.display = 'block';
    textarea.readOnly = true;
  }
};

//[共有する]ボタン押下時
let shareId;
let shareTitle;
export function shareButtonClick(id, event) {
  document.getElementById('popup-overlay_share').style.display = 'block';
  shareId = id;
  shareTitle = event.target.previousElementSibling.innerHTML;
}

document.getElementById('share-send').addEventListener('click', (e) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDateTime = `${year}-${month}-${day}-${hours}:${minutes}`;

  const inputValue = document.getElementsByClassName('share-input')[0].value;
  const inputValues = inputValue.split(',').map((value) => value.trim());

  if (!inputValues.includes(document.getElementById('sab-title').innerHTML)) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'getuser',
        id: shareId,
        name: inputValues,
        title: shareTitle,
        time: formattedDateTime,
      }),
      success: function (res) {
        if (res.nothingUser.length === 0) {
          document.getElementById('popup-overlay_share').style.display = 'none';
          document.getElementById('popup-overlay_share_ans').style.display =
            'block';
          setTimeout(function () {
            document.getElementById('popup-overlay_share_ans').style.display =
              'none';
          }, 1500);
        } else {
          //見つからないユーザーがあるパターン
          document.getElementById('popup-overlay_share_no').style.display =
            'block';
          document.getElementById(
            'nothingUser'
          ).innerHTML = `${res.nothingUser}が見つかりませんでした。
        その他のユーザーには共有しました。`;
          setTimeout(function () {
            document.getElementById('popup-overlay_share_no').style.display =
              'none';
          }, 3000);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {},
    });
  } else {
    alert('自分自身は共有できません');
  }
});

document.getElementById('pop-delete_share').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_share').style.display = 'none';
});

//フォーカスの当たっているタブを削除する際には違うタブにフォーカスを当てる
export const closeTab = (id, order, tabIdArray) => {
  document.getElementById('TAB-ID' + id).remove();
  document.getElementById('tab-ID' + id).remove();
  document.getElementById('Tab-ID' + id).remove();
  $.ajax({
    url: '/tabPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'tabDelete',
      id,
      order,
    }),
    success: function (res) {
      const focusFlg = res.tabResult.focus;
      let result = tabIdArray.indexOf(id);
      if (focusFlg === 1) {
        if (result !== 0) {
          $(`#tab-ID${tabIdArray[result - 1]}`).trigger('click');
          //tabArrayの０番目の場合。タブの一番上の場合
        } else {
          $(`#tab-ID${tabIdArray[result + 1]}`).trigger('click');
        }
      }
    },
  });
};

//タブ上の✖️ボタン押下時
export const closeButton = (id, title, tabArray) => {
  const order = orderGet('tab-content', `Tab-ID${id}`);
  closeTab(id, order, tabArray);
};

//タブクリック時
export const tabClick = (e, id, title) => {
  //タブの「✖️」ボタン以外押下時
  if (!e.target.closest('.buttonTab')) {
    //パスを取得する関数
    let pass = passGet(id, document.getElementById('tabname' + id).innerHTML);
    //クリックしたTabのfocusを1へ、その他を0へ。passも更新
    $.ajax({
      url: '/tabPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'updateFocus',
        id,
        title,
      }),
      success: function (res) {
        document.getElementById('notepass').innerHTML = pass;
      },
    });
  } else {
    //タブ閉じるボタン押下
  }
};

//タブのラベルをランダムな色に付与する
const tabLabelColorGet = (id) => {
  $.ajax({
    url: '/tabPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'labelColorGet',
      id,
    }),
    success: function (res) {
      const label = document.getElementById(`tab-ID${id}`);
      //tab-labelに色を割り当てる
      label.style.setProperty('--tab-label-background-color', res.labelColor);
    },
  });
};

//タブ削除したタイトルのIDをtabArrayから削除
export const deleteTabArray = (id, tabArray) => {
  tabArray = tabArray.filter((n) => n !== id);
  //タブを全削除したらnotabを表示。「ここにノートの情報が〜」のやつ
  if (tabArray.length == 0) {
    document.getElementById('notab').style.display = 'block';
    document.getElementById('notepass').innerHTML = '';
  }
  return tabArray;
};

//共有履歴　ユーザー一覧
document.getElementById('share-user-button').addEventListener('click', () => {
  document.getElementById('popup-overlay_share-user').style.display = 'block';
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'ShareList',
    }),
    success: function (res) {
      let shareUserNameArray = []; //全ての共有履歴のユーザーを一通り見るための配列(実行したら格納)
      res.shareResult.forEach((share) => {
        if (!shareUserNameArray.includes(share.UserName)) {
          // チェックボックス要素の作成
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `checkbox${share.UserName}`;

          // ラベル要素の作成
          const checkboxLabel = document.createElement('label');
          checkboxLabel.textContent = share.UserName;
          checkboxLabel.setAttribute('for', `checkbox${share.UserName}`);

          // 要素の追加
          document.getElementById('share-user-div').appendChild(checkbox);
          document.getElementById('share-user-div').appendChild(checkboxLabel);
          document
            .getElementById('share-user-div')
            .appendChild(document.createElement('br'));

          shareUserNameArray.push(share.UserName);
        }
      });

      const inputValue =
        document.getElementsByClassName('share-input')[0].value;
      const trimmedValue = inputValue.trim();
      const inputValues = trimmedValue.split(',').map((value) => value.trim());

      //全てのlabelタグのinnerHTMLを配列に格納(共有履歴のユーザー名)
      const labelInnerHTMLs = Array.from(
        document.querySelectorAll('#share-user-div label')
      ).map((label) => label.innerHTML);

      inputValues.forEach((val) => {
        if (labelInnerHTMLs.includes(val)) {
          document.getElementById(`checkbox${val}`).checked = true;
        }
      });
    },
  });
});

document
  .getElementById('share-user-add-button')
  .addEventListener('click', () => {
    document.getElementsByClassName('share-input')[0].value = '';
    const checkedElements = document.querySelectorAll(
      '#share-user-div input[type="checkbox"]:checked'
    );
    let shareUserNames = [];
    checkedElements.forEach((val) => {
      const shareUserName = val.nextElementSibling.innerHTML;
      shareUserNames.push(shareUserName);
    });

    document.getElementsByClassName('share-input')[0].value =
      shareUserNames.join(', ');

    document.getElementById('popup-overlay_share-user').style.display = 'none';
    while (document.getElementById('share-user-div').firstChild) {
      document
        .getElementById('share-user-div')
        .removeChild(document.getElementById('share-user-div').firstChild);
    }
  });

document
  .getElementById('share-user-clear-button')
  .addEventListener('click', () => {
    const checkboxes = document.querySelectorAll(
      '#share-user-div input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

document
  .getElementById('pop-delete_share-user')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_share-user').style.display = 'none';
    //配下の要素全削除。ボタン押すたびに追加されるため・・
    while (document.getElementById('share-user-div').firstChild) {
      document
        .getElementById('share-user-div')
        .removeChild(document.getElementById('share-user-div').firstChild);
    }
  });

//共有履歴ポップアップのカーソル移動
function makeDraggable(element) {
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  element.addEventListener('mousedown', (event) => {
    isDragging = true;

    const rect = element.getBoundingClientRect();
    offset.x = event.clientX - rect.left;
    offset.y = event.clientY - rect.top;
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      element.style.left = event.clientX - offset.x - 25 + 'px';
      element.style.top = event.clientY - offset.y - 25 + 'px';
    }
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
const draggablePopup = document.getElementById('draggable-popup');
makeDraggable(draggablePopup);
