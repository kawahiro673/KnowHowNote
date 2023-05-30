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
  labelTab.classList.add('tab-label');

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
  const tabClosebutton = document.createElement('button');
  tabClosebutton.setAttribute('class', 'tabClosebutton');
  tabClosebutton.setAttribute('id', 'button' + id);
  tabClosebutton.innerHTML = '×';

  const div = document.createElement('div');
  div.className = 'tab-content';
  div.setAttribute('id', 'Tab-ID' + id);
  div.setAttribute('value', id);

  const div1 = document.createElement('div');
  div1.setAttribute('class', 'title');

  const p = document.createElement('p');
  p.setAttribute('class', 'title-txt');
  p.style.fontSize = '25px';
  p.style.color = 'black';
  p.style.textAlign = 'left';
  p.setAttribute('id', 'tabP' + id);
  p.innerHTML = res.title;

  const shareButton = document.createElement('button');
  shareButton.setAttribute('class', 'sharebtn');
  shareButton.setAttribute('id', `share-button-${id}`);
  shareButton.innerHTML = '共有する';
  shareButton.disabled = false;

  const divFade = document.createElement('div');

  const div2 = document.createElement('div');
  div2.setAttribute('class', 'form-group');

  const textarea = document.createElement('textarea');
  textarea.readOnly = true;
  textarea.style.height = '700px';
  textarea.innerHTML = res.memo_text;
  textarea.setAttribute('id', `textarea${id}`);

  const editButton = document.createElement('button');
  editButton.setAttribute('class', 'editbtn');
  editButton.setAttribute('id', `edit-note-btn${id}`);
  editButton.innerHTML = '編集する';

  const fadeFont = document.createElement('p');
  fadeFont.setAttribute('class', 'fade-out-font');
  fadeFont.classList.add('fadeout');
  fadeFont.setAttribute('id', `fade${id}`);
  fadeFont.style.visibility = 'hidden';

  const time = document.createElement('p');
  time.setAttribute('class', 'updatetime');
  time.setAttribute('id', `time${id}`);
  time.style.color = 'black';
  time.innerHTML = res.saved_time;

  const keepButton = document.createElement('button');
  keepButton.innerHTML = '保存する';
  keepButton.setAttribute('class', 'keepbtn');
  keepButton.setAttribute('id', `keep-note-btn${id}`);
  keepButton.style.display = 'none';

  const cancelButton = document.createElement('button');
  cancelButton.innerHTML = '取り消す';
  cancelButton.setAttribute('class', 'cancelbtn');
  cancelButton.setAttribute('id', `cancel-note-btn${id}`);
  cancelButton.style.display = 'none';

  const titletext = document.createElement('input');

  titletext.setAttribute('id', `titletext${id}`);
  titletext.style.display = 'none';

  //要素追加
  tab.appendChild(inputTab);
  tab.appendChild(labelTab);
  labelTab.appendChild(tabname);
  labelTab.appendChild(tabClosebutton);
  labelTab.appendChild(labelColor);
  tab.appendChild(div);
  div.appendChild(div1);
  div.appendChild(divFade);
  div.appendChild(div2);
  div1.appendChild(p);
  div1.appendChild(titletext);
  div1.appendChild(shareButton);
  div2.appendChild(textarea);
  div.appendChild(editButton);
  div.appendChild(keepButton);
  div.appendChild(cancelButton);
  divFade.appendChild(fadeFont);
  div.appendChild(time);
  tabLabelColorGet(id);

  return [editButton, shareButton, tabClosebutton];
};

//タブエリアの[保存]ボタン押下時
export const keepButtonClick = (id) => {
  const newTitle = document.getElementById(`titletext${id}`).value;
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
      memoContent: document.getElementById(`textarea${id}`).value, //ここに入力した値が入る
      time,
    }),
    success: function (res) {
      document.getElementById(`fade${id}`).style.visibility = 'visible';

      document.getElementById(`fade${id}`).textContent =
        '保存が完了いたしました';

      setTimeout(() => {
        document.getElementById(`fade${id}`).style.visibility = 'hidden';
      }, 1000);

      document.getElementById(`share-button-${id}`).disabled = false;
      document.getElementById(`share-button-${id}`).style.backgroundColor =
        '#007bff';
    },
  });
  document.getElementById(`keep-note-btn${id}`).style.display = 'none';
  document.getElementById(`cancel-note-btn${id}`).style.display = 'none';
  document.getElementById(`tabP${id}`).innerHTML = newTitle;
  document.getElementById(`tabP${id}`).style.display = 'block';
  document.getElementById(`tabname${id}`).innerHTML = newTitle;
  document.getElementById(`file${id}`).innerHTML = newTitle;
  document.getElementById(`titletext${id}`).style.display = 'none';
  document.getElementById(`edit-note-btn${id}`).style.display = 'block';
  document.getElementById(`textarea${id}`).readOnly = true;
  document.getElementById(`time${id}`).innerHTML = time;
  document.getElementById('notepass').innerHTML = pass;
};

//タブエリアの[取り消し]ボタン押下時
export const cancelButtonClick = (id) => {
  if (
    confirm(
      '本当に編集を取り消しますか？\n保存していないものは取り消されます。'
    )
  ) {
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
        document.getElementById(`textarea${id}`).value =
          res.fileResult.memo_text;
        document.getElementById(`share-button-${id}`).disabled = false;
        document.getElementById(`share-button-${id}`).style.backgroundColor =
          '#007bff';
      },
    });
    document.getElementById(`tabP${id}`).style.display = 'block';
    document.getElementById(`keep-note-btn${id}`).style.display = 'none';
    document.getElementById(`cancel-note-btn${id}`).style.display = 'none';
    document.getElementById(`titletext${id}`).style.display = 'none';
    document.getElementById(`edit-note-btn${id}`).style.display = 'block';
    document.getElementById(`textarea${id}`).readOnly = true;
    document.getElementById(`fade${id}`).style.visibility = 'hidden';
  }
};

//[共有する]ボタン押下時
let shareId;
let shareTitle;
export function shareButtonClick(id, event) {
  document.getElementById('popup-overlay_share').style.display = 'block';
  shareId = id;
  shareTitle = event.target.parentNode.querySelectorAll('p')[0].innerHTML;
}

document.getElementById('share-send').addEventListener('click', (e) => {
  const inputValue = document.getElementsByClassName('share-input')[0].value;
  const inputValues = inputValue.split(',').map((value) => value.trim());
  const shareMessage =
    document.getElementsByClassName('share-message')[0].value;

  if (!inputValues.includes(document.getElementById('user_name').innerHTML)) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'getuser',
        id: shareId,
        myName: document.getElementById('user_name').innerHTML,
        name: inputValues,
        title: shareTitle,
        message: shareMessage,
        time: currentTimeGet(),
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
          setTimeout(() => {
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
      if (res.tabResult.focus === 1) {
        if (tabIdArray.indexOf(id) !== 0) {
          $(`#tab-ID${tabIdArray[tabIdArray.indexOf(id) - 1]}`).trigger(
            'click'
          );
          //tabArrayの０番目の場合。タブの一番上の場合
        } else {
          $(`#tab-ID${tabIdArray[tabIdArray.indexOf(id) + 1]}`).trigger(
            'click'
          );
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
  if (!e.target.closest('.tabClosebutton')) {
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
  if (tabArray.length === 0) {
    document.getElementById('notab').style.display = 'block';
    document.getElementById('notepass').innerHTML = '';
    document.querySelectorAll('.image-container').forEach((container) => {
      container.remove();
    });
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

//バインダーのリング部分作成
export const binderCreate = () => {
  for (let i = 0; i < 21; i++) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const image = document.createElement('img');
    image.src = '../img/ringnote_w.gif';
    image.alt = 'Image';

    imageContainer.appendChild(image);
    document.getElementById('tab').appendChild(imageContainer);
  }
};

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
