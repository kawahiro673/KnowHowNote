//タブで必要な関数まとめ
import {
  currentTimeGet,
  passGet,
  orderGet,
  resultPopUp,
} from './stringUtils.js';
import { hashedIdGet, setTabIdArray } from './main.js';

export const tabCreate = (id, title, res) => {
  console.log('やあ3');
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

  const labelColor = document.createElement('div');
  labelColor.setAttribute('class', 'label-color');
  labelColor.setAttribute('id', 'label-color' + id);

  const tabname = document.createElement('p');
  tabname.setAttribute('class', 'tabname');
  tabname.setAttribute('id', 'tabname' + id);
  tabname.style.fontSize = '18px';
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

  const divFade = document.createElement('div');

  const div2 = document.createElement('div');
  div2.setAttribute('class', 'form-group');

  const div3 = document.createElement('div');
  div3.setAttribute('class', 'title-btns');

  const textarea = document.createElement('textarea');
  textarea.readOnly = true;
  textarea.innerHTML = res.memo_text;
  textarea.setAttribute('id', `textarea${id}`);

  const editButton = document.createElement('button');
  editButton.setAttribute('class', 'editbtn');
  editButton.setAttribute('id', `edit-note-btn${id}`);
  editButton.innerHTML = '編集';

  const fadeFont = document.createElement('p');
  fadeFont.setAttribute('class', 'fade-out-font');
  fadeFont.classList.add('fadeout');
  fadeFont.setAttribute('id', `fade${id}`);
  fadeFont.innerHTML = '☆';
  fadeFont.style.color = 'white';

  const time = document.createElement('p');
  time.setAttribute('class', 'updatetime');
  time.setAttribute('id', `time${id}`);
  time.innerHTML = res.saved_time;

  const shareButton = document.createElement('button');
  shareButton.setAttribute('class', 'sharebtn');
  shareButton.setAttribute('id', `share-button-${id}`);
  shareButton.innerHTML = '共有';
  shareButton.disabled = false;
  shareButton.addEventListener('click', shareButtonClick.bind(null, id, title));

  const keepButton = document.createElement('button');
  keepButton.innerHTML = '保存';
  keepButton.setAttribute('class', 'keepbtn');
  keepButton.setAttribute('id', `keep-note-btn${id}`);
  keepButton.style.display = 'none';
  keepButton.addEventListener('click', keepButtonClick.bind(null, id));

  const cancelButton = document.createElement('button');
  cancelButton.innerHTML = '取り消す';
  cancelButton.setAttribute('class', 'cancelbtn');
  cancelButton.setAttribute('id', `cancel-note-btn${id}`);
  cancelButton.style.display = 'none';
  cancelButton.addEventListener('click', cancelButtonClick.bind(null, id));

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
  div1.appendChild(div3);
  div3.appendChild(editButton);
  div3.appendChild(keepButton);
  div3.appendChild(cancelButton);
  div3.appendChild(shareButton);
  div2.appendChild(textarea);
  divFade.appendChild(fadeFont);
  div.appendChild(time);
  tabLabelColorGet(id);

  return [editButton, shareButton, tabClosebutton];
};

////////////////////////////////////////////////////////////////
//////////////////////////////保存//////////////////////////////
////////////////////////////////////////////////////////////////

//タブエリアの[保存]ボタン押下時
export const keepButtonClick = (id) => {
  const newTitle = document.getElementById(`titletext${id}`).value;
  if (newTitle !== '') {
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
        document.getElementById(`fade${id}`).style.opacity = '1';
        document.getElementById(`fade${id}`).style.color = 'red';
        document.getElementById(`fade${id}`).textContent =
          '保存が完了いたしました';

        setTimeout(() => {
          document.getElementById(`fade${id}`).style.opacity = '0';
        }, 1000);
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
    document.getElementById(`share-button-${id}`).style.display = 'block';
    document.getElementById(`textarea${id}`).readOnly = true;
    document.getElementById(`time${id}`).innerHTML = time;
    document.getElementById('notepass').innerHTML = pass;
    document.getElementById(`tabname${id}`).style.color = 'black';
  } else {
    alert('タイトルを入力してください');
  }
};

////////////////////////////////////////////////////////////////
/////////////////////////////取り消し////////////////////////////
////////////////////////////////////////////////////////////////

//タブエリアの[取り消し]ボタン押下時
export const cancelButtonClick = (id) => {
  document.getElementById('popup-overlay_keep-cancel').style.display = 'block';

  const nouhauKeepCancelButtonListener = () => {
    nouhauKeepCancel(id);
    document.getElementById('popup-overlay_keep-cancel').style.display = 'none';
    document
      .getElementById('yes-button-keep-cancel')
      .removeEventListener('click', nouhauKeepCancelButtonListener);
  };

  document
    .getElementById('yes-button-keep-cancel')
    .addEventListener('click', nouhauKeepCancelButtonListener);
};

const nouhauKeepCancel = (id) => {
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
      document.getElementById(`textarea${id}`).value = res.fileResult.memo_text;
    },
  });
  document.getElementById(`tabP${id}`).style.display = 'block';
  document.getElementById(`keep-note-btn${id}`).style.display = 'none';
  document.getElementById(`cancel-note-btn${id}`).style.display = 'none';
  document.getElementById(`titletext${id}`).style.display = 'none';
  document.getElementById(`edit-note-btn${id}`).style.display = 'block';
  document.getElementById(`share-button-${id}`).style.display = 'block';
  document.getElementById(`textarea${id}`).readOnly = true;
  document.getElementById(`fade${id}`).style.opacity = '0';
  document.getElementById(`tabname${id}`).style.color = 'black';

  resultPopUp('取り消し', '取り消しました');
};

document
  .getElementById('pop-delete_keep-cancel')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_keep-cancel').style.display = 'none';
  });

document
  .getElementById('no-button-keep-cancel')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_keep-cancel').style.display = 'none';
  });

////////////////////////////////////////////////////////////////
/////////////////////////////共有機能////////////////////////////
////////////////////////////////////////////////////////////////
let tmpID;
let tmpTitle;
let shareSendListenerAdded = false;
const shareSendButton = document.getElementById('share-send');

export function shareButtonClick(id, title, flg) {
  document.getElementById('popup-overlay_share').style.display = 'block';
  document.getElementById('share-nouhau-name').innerHTML = title;
  tmpID = id;
  tmpTitle = title;

  if (!shareSendListenerAdded) {
    shareSendButton.addEventListener('click', onClick);
    shareSendListenerAdded = true;
  }
}

function onClick(event) {
  shareNoteSendFunc(tmpID, tmpTitle);

  shareSendButton.removeEventListener('click', onClick);
  shareSendListenerAdded = false;
}

export const shareNoteSendFunc = (id, title) => {
  console.log(title + ' ?');
  console.log(id + ' ?');
  const inputValue = document.getElementsByClassName('share-input')[0].value;
  const inputValues = inputValue.split(',').map((value) => value.trim());

  const shareMessage =
    document.getElementsByClassName('share-message')[0].value;
  //配列の文字列を全て数値へ
  const numArray = shareUserValues.map((str) => parseInt(str));

  //inputタブに自分の名前が含まれていない場合のみ実行
  if (inputValue !== '') {
    $.ajax({
      url: '/sharePostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'getuser',
        id,
        myName: document.getElementById('user_name').innerHTML,
        name: inputValues,
        title,
        message: shareMessage,
        time: currentTimeGet(),
        RecipientIDs: numArray,
        RecipientGroups: shareGroupValues,
      }),
      success: function (res) {
        if (res.nothingUser.length === 0) {
          document.getElementById('popup-overlay_share').style.display = 'none';
          resultPopUp('共有', '共有しました');
        } else {
          //見つからないユーザーがあるパターン
          document.getElementById('popup-overlay_share_no').style.display =
            'block';
          document.getElementById(
            'nothingUser'
          ).innerHTML = `${res.nothingUser} は見つかりませんでした。
        アカウントが削除された可能性があります。`;
          setTimeout(() => {
            document.getElementById('popup-overlay_share_no').style.display =
              'none';
          }, 3000);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {},
    });
  } else {
    alert('フレンドリストから共有したいユーザー/グループを選択してください');
  }
};

//共有履歴　ユーザー一覧
document.getElementById('share-user-button').addEventListener('click', () => {
  document.getElementById('popup-overlay_share-user').style.display = 'block';
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'friend-list-get',
    }),
    success: function (res) {
      //ユーザ側のチェックボックス作成
      res.friend.forEach((friend) => {
        const div = document.createElement('div');
        div.setAttribute('class', `friend-list-check-div`);

        // チェックボックス要素の作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox${friend.Changed_Name}`;
        checkbox.value = friend.id;

        // ラベル要素の作成
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = friend.Changed_Name;
        checkboxLabel.setAttribute('for', `checkbox${friend.Changed_Name}`);

        // 要素の追加
        document.getElementById('share-user-div').appendChild(div);
        div.appendChild(checkbox);
        div.appendChild(checkboxLabel);
      });

      const popupGroupMember = document.getElementById('popup-group-member');
      let timer;
      let isPopupShown = false;

      //グループ側のチェックボックス作成
      let groupFlg = false;
      const groupSet = new Set(); // ユニークな User_Group を格納するための Set
      res.friend.forEach((friend) => {
        if (friend.User_Group !== 'なし') {
          const userGroup = friend.User_Group;
          if (!groupSet.has(userGroup)) {
            groupSet.add(userGroup);
            groupFlg = true;

            const div = document.createElement('div');
            div.setAttribute('class', 'friend-list-group-check-div');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox${userGroup}`;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = userGroup;
            checkboxLabel.setAttribute('for', `checkbox${userGroup}`);
            checkboxLabel.setAttribute('class', `popup-label`);

            document.getElementById('share-group-div').appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(checkboxLabel);

            // ラベル要素にマウスカーソルが入ったときの処理
            div.addEventListener('mouseenter', (event) => {
              if (!isPopupShown) {
                // タイマーをクリアして遅延処理を実行。タイマーがないと、連続してDB参照してしまうため、サーバー不具合発生
                clearTimeout(timer);
                timer = setTimeout(() => {
                  popupGroupMember.style.display = 'block';

                  // マウスの座標を取得し、ポップアップ要素を移動
                  popupGroupMember.style.left = event.clientX + 'px';
                  popupGroupMember.style.top = event.clientY + 'px';

                  $.ajax({
                    url: '/mypage/' + hashedIdGet,
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
                    },
                  });
                  isPopupShown = true;
                }, 500);
              }
            });

            // ラベル要素からマウスカーソルが出たときの処理
            div.addEventListener('mouseleave', () => {
              // タイマーをクリアしてポップアップを非表示にする
              clearTimeout(timer);
              popupGroupMember.style.display = 'none';
              isPopupShown = false;
            });
          }
        }
      });

      if (!groupFlg) {
        const p = document.createElement('p');
        p.innerHTML = '※グループに所属しているユーザーがいません';
        p.setAttribute('class','group-list-none-belong')
        document.getElementById('share-group-div').appendChild(p);
      }

      if (res.friend.length === 0) {
        const p = document.createElement('p');
        p.innerHTML = '※フレンドが登録されていません';
        p.setAttribute('class','friend-list-none-register');
        document.getElementById('share-user-div').appendChild(p);
      }

      const inputValue =
        document.getElementsByClassName('share-input')[0].value;
      const trimmedValue = inputValue.trim();
      const inputValues = trimmedValue.split(',').map((value) => value.trim());

      //#share-user-div配下のlabelタグのinnerHTMLを配列に格納(共有履歴のユーザー名)
      const labelInnerHTMLs_user = Array.from(
        document.querySelectorAll('#share-user-div label')
      ).map((label) => label.innerHTML);

      const labelInnerHTMLs_group = Array.from(
        document.querySelectorAll('#share-group-div label')
      ).map((label) => label.innerHTML);

      inputValues.forEach((val) => {
        if (labelInnerHTMLs_user.includes(val)) {
          document.getElementById(`checkbox${val}`).checked = true;
        }
        if (labelInnerHTMLs_group.includes(val)) {
          document.getElementById(`checkbox${val}`).checked = true;
        }
      });
    },
  });
});

let shareUserValues = [];
let shareGroupValues = [];

document
  .getElementById('share-user-add-button')
  .addEventListener('click', () => {
    //チェックの入っているlabelの文字列を配列に保存し、inputへ「,」をつけて出力
    document.getElementsByClassName('share-input')[0].value = '';
    const checkedElements = document.querySelectorAll(
      '#share-user-div input[type="checkbox"]:checked'
    );
    const checkedElements_g = document.querySelectorAll(
      '#share-group-div input[type="checkbox"]:checked'
    );

    let shareUserNames = [];

    checkedElements.forEach((val) => {
      const shareUserName = val.nextElementSibling.innerHTML;
      shareUserNames.push(shareUserName);
    });
    checkedElements_g.forEach((val) => {
      const shareUserName = val.nextElementSibling.innerHTML;
      shareUserNames.push(shareUserName);
    });

    //チェックに入れたユーザーのfrined_listのid取得
    shareUserValues = [];
    checkedElements.forEach((val) => {
      const shareUserValue = val.value;
      shareUserValues.push(shareUserValue);
    });
    //チェック入れたグループ名を取得
    shareGroupValues = [];
    checkedElements_g.forEach((val) => {
      const shareGroupValue = val.id.replace('checkbox', '');
      shareGroupValues.push(shareGroupValue);
    });

    document.getElementsByClassName('share-input')[0].value =
      shareUserNames.join(', ');
    //追加ボタン押下時に要素を消している。でないと追加で増え続ける。。。
    document.getElementById('popup-overlay_share-user').style.display = 'none';
    while (document.getElementById('share-user-div').firstChild) {
      document
        .getElementById('share-user-div')
        .removeChild(document.getElementById('share-user-div').firstChild);
    }
    while (document.getElementById('share-group-div').firstChild) {
      document
        .getElementById('share-group-div')
        .removeChild(document.getElementById('share-group-div').firstChild);
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
    const checkboxes_g = document.querySelectorAll(
      '#share-group-div input[type="checkbox"]'
    );
    checkboxes_g.forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

document
  .getElementById('pop-delete_share-user')
  .addEventListener('click', (e) => {
    e.preventDefault(); // リンクのデフォルトの動作を無効化
    document.getElementById('popup-overlay_share-user').style.display = 'none';
    //配下の要素全削除。ボタン押すたびに追加されるため
    while (document.getElementById('share-user-div').firstChild) {
      document
        .getElementById('share-user-div')
        .removeChild(document.getElementById('share-user-div').firstChild);
    }
    while (document.getElementById('share-group-div').firstChild) {
      document
        .getElementById('share-group-div')
        .removeChild(document.getElementById('share-group-div').firstChild);
    }
  });

document.getElementById('pop-delete_share').addEventListener('click', (e) => {
  e.preventDefault(); // リンクのデフォルトの動作を無効化
  document.getElementById('popup-overlay_share').style.display = 'none';
});

////////////////////////////////////////////////////////////////
/////////////////////////////タブ機能////////////////////////////
////////////////////////////////////////////////////////////////

//フォーカスの当たっているタブを削除する際には違うタブにフォーカスを当てる
export const closeTab = async (id, order, tabIdArray) => {
  // awaitを使ってajaxの処理を非同期待ち合わせ
  await new Promise((resolve, reject) => {
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
        document.getElementById('TAB-ID' + id).remove();
        document.getElementById('tab-ID' + id).remove();
        document.getElementById('Tab-ID' + id).remove();
        if (res.tabResult.focus === 1) {
          document.getElementById('tab_loader').style.display = 'block';
          // フェードアウト(cssのanimation)が完了したらdisplay=none
          (async () => {
            document.getElementById('tab_loader').classList.add('loaded');
            await new Promise((resolve) => {
              const tabLoader = document.getElementById('tab_loader');
              tabLoader.addEventListener(
                'animationend',
                () => {
                  document.getElementById('tab_loader').style.display = 'none';
                  resolve();
                },
                { once: true }
              );
            });
          })();
          if (tabIdArray.indexOf(id) !== 0) {
            $(`#tab-ID${tabIdArray[tabIdArray.indexOf(id) - 1]}`).trigger(
              'click'
            );
            //tabIdArrayの０番目の場合。タブの一番上の場合
          } else {
            $(`#tab-ID${tabIdArray[tabIdArray.indexOf(id) + 1]}`).trigger(
              'click'
            );
          }
        }
        resolve();
      },
      error: function (err) {
        reject(err); // 非同期処理が失敗した場合にreject()を呼ぶ
      },
    });
  });
  deleteTabIdArray(id, tabIdArray);
};

//タブ上の✖️ボタン押下時
export const closeButton = async (id, title, tabIdArray) => {
  const order = orderGet('tab-content', `Tab-ID${id}`);
  await closeTab(id, order, tabIdArray);
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

//タブ削除したタイトルのIDをtabIdArrayから削除
export const deleteTabIdArray = (id, tabIdArray) => {
  tabIdArray = tabIdArray.filter((n) => n !== id);
  //タブを全削除したらnotabを表示。「ここにノートの情報が〜」のやつ
  if (tabIdArray.length === 0) {
    document.getElementById('notab').style.display = 'block';
    document.getElementById('notepass').innerHTML = '';
    document.querySelectorAll('.image-container').forEach((container) => {
      container.remove();
    });
  }
  console.log(tabIdArray);
  setTabIdArray(tabIdArray);
};

//バインダーのリング部分作成
export const binderCreate = () => {
  //一度全てのバインダーリングを削除し、再構築
  const elementsArray = Array.from(
    document.getElementsByClassName('image-container')
  );
  elementsArray.forEach((element) => {
    element.remove();
  });

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
