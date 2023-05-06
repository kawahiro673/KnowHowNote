import {
  keepButton,
  cancelButton,
  shareButton,
  closeButton,
  tabClick,
  deleteTabArray,
  tabCreate,
} from './tab_func.js';

import { fileContextmenu } from './note_contextmenu.js';
import { folderContextmenu } from './folder_contextmenu.js';
import { shareContextmenu } from './share_contextmenu.js';
import { labelContextmenu } from './label_contextmenu.js';

import { jQueryUIOptionsFunc } from './jQueryUI_func.js';

import { newFileCreateFunc } from './newFileCreate.js';
import { newFolderCreateFunc } from './newFolderCreate.js';

import { orderGet, passGet } from './stringUtils.js';

import { expandableAdaptation } from './expandableOptions.js';

let tabIdArray = []; //タブが生成されているファイルのIDを格納
let tabFocusID; //　フォーカスが当たっているタブのIDを常に保持。フォルダ名の名前変更・D&D時のパス変更に使用。

export const listCreate = () => {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'list',
    }),
    success: async (res) => {
      if (res.status === 500) {
        console.log('ログイン画面に戻ります');
        location.href = 'https://nodejs-itnote-app.herokuapp.com/login';
      }
      document.getElementById('sab-title').innerHTML = res.userName;

      let resTmp = Array.from(res.response);
      let resTmp2 = Array.from(res.response2);
      let parentIdArray = []; //親フォルダになりうるフォルダを追加
      let deleteArray = [];
      let crFlg = true; //要素が生成されたかどうか
      let orderNumber = 0; //orderが1のものから順番に作成していく
      let array = resTmp.concat(resTmp2); //resTmpとresTmp2を結合
      let expandableArray = [];

      parentIdArray.push(0); //rootである0を追加

      //folderとfileを全て作成するまで(resTmpとresTmp2の結合配列arrayが空になるまで)
      while (array.length !== 0) {
        parentIdArray.forEach((parentId) => {
          orderNumber = 0;
          //要素が作成される間繰り返す(file or folder)
          while (crFlg == true) {
            crFlg = false;
            orderNumber++;
            for (const hoge of Object.keys(res.response)) {
              const folder = res.response[hoge];
              //parentIdが合致すれば子要素として追加
              if (
                folder.parent_id == parentId &&
                orderNumber == folder.folder_order
              ) {
                //要素作成
                let li = document.createElement('li');
                li.setAttribute('class', `parent${folder.parent_id}`);
                li.setAttribute('id', `foli${folder.id}`);
                let span = document.createElement('span');
                span.setAttribute('class', 'folder');
                span.setAttribute('id', `folder${folder.id}`);
                span.setAttribute('value', `${folder.id}`);
                span.innerHTML = folder.folder_name;
                let ul = document.createElement('ul');
                ul.setAttribute('id', `${folder.id}`);
                ul.setAttribute('class', `f_${folder.id}`);
                //追加
                document.getElementById(`${parentId}`).appendChild(li);
                li.appendChild(span);
                li.appendChild(ul);
                //重複していなければ追加
                if (parentIdArray.indexOf(folder.id) == -1) {
                  parentIdArray.push(folder.id);
                }
                resTmp.splice(resTmp.indexOf(folder), 1);
                crFlg = true;

                //リストの開き設定
                if (folder.closed == 'off') {
                  expandableArray.push(folder.id);
                }
              }
            }
            //file追加
            for (const hoge of Object.keys(resTmp2)) {
              const file = resTmp2[hoge];
              //for (const file of resTmp2) {
              if (
                file.parent_id == parentId &&
                orderNumber == file.folder_order &&
                crFlg == false //フォルダで未作成の場合
              ) {
                //要素作成
                let li = document.createElement('li');
                li.setAttribute('class', `parent${file.parent_id}`);
                li.setAttribute('id', `li${file.id}`);
                let span = document.createElement('span');
                span.setAttribute('class', 'list_title file');
                span.setAttribute('id', `file${file.id}`);
                span.style.color = file.title_color;
                span.setAttribute('value', `${file.id}`);
                span.innerHTML = file.title;
                document.getElementById(`${parentId}`).appendChild(li);
                li.appendChild(span);
                deleteArray.push(file);
                crFlg = true;
              }
            }
            //一度表示したファイルをresTmp2から削除(forEach内で削除すると配列番号がズレてバグるため)
            deleteArray.forEach((file) => {
              if (resTmp2.includes(file)) {
                resTmp2.splice(resTmp2.indexOf(file), 1);
              }
            });
            deleteArray = [];
          }
          //要素が作成されなければ配列から削除
          if (crFlg == false) {
            parentIdArray.splice(parentIdArray.indexOf(parentId), 1);
          }
          crFlg = true;
        });
        array = resTmp.concat(resTmp2);
      }

      await jQueryUIOptionsFunc();
      fileContextmenu(tabIdArray);
      folderContextmenu(tabIdArray);
      fileClick();
      await expandableAdaptation(expandableArray);
    },
  });
};

//「マイノウハウ」タブにファイル/フォルダ全て表示
//DBから全ての情報を取得
function shareListCreate() {
  $.ajax({
    url: '/sharePostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'sharelist',
    }),
    success: function (res) {
      res.fileResult.forEach((file) => {
        //要素作成
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.setAttribute('class', 'sharenote file');
        span.setAttribute('value', file.id);
        span.innerHTML = file.title;
        document.getElementById('sharelist').appendChild(li);
        li.appendChild(span);
        shareContextmenu();
      });
    },
  });
}

listCreate();
tabUpload();
shareListCreate();

const conme = document.getElementById('contextmenu');
const conme2 = document.getElementById('contextmenu2');
const conme3 = document.getElementById('contextmenu3');
const conme4 = document.getElementById('contextmenu4');
const conme5 = document.getElementById('contextmenu5');

$('#right').on('click contextmenu', (e) => {
  if (e.target.closest('.list_title')) {
    conme.style.left = e.pageX + 'px';
    conme.style.top = e.pageY + 'px';
    conme.style.display = 'block';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  } else if (e.target.closest('.folder')) {
    conme3.style.left = e.pageX + 'px';
    conme3.style.top = e.pageY + 'px';
    conme3.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  } else if (e.target.closest('.sharenote')) {
    conme4.style.left = e.pageX + 'px';
    conme4.style.top = e.pageY + 'px';
    conme4.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme5.style.display = 'none';
  } else {
    conme2.style.left = e.pageX + 'px';
    conme2.style.top = e.pageY + 'px';
    conme2.style.display = 'block';
    conme.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  }
  document.body.addEventListener('click', function (e) {
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  });
});
$('html').on('click contextmenu', (e) => {
  let a = $(e.target).closest('#right').length;
  if (a) {
    //rightの上
  } else {
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
  }
});

const noTab = document.createElement('p');
noTab.innerHTML = 'こちらにnoteが出力されます';
noTab.setAttribute('id', 'notab');
document.getElementById('tab').appendChild(noTab);

//ファイルクリック時にタブを表示
export const fileClick = () => {
  $('.list_title').on('click', function () {
    let file = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };
    console.log(`"${file.title}"がクリックされました。`);
    let id = Number(file.id);
    titleClick(id, file.title);
    const pass = passGet(file.id, file.title);
    let isSomething = tabIdArray.includes(id);
    $.ajax({
      url: '/tabPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'tabAdd',
        isSomething,
        id,
        title: file.title,
      }),
      success: function (res) {
        const order = orderGet('tab-content', `Tab-ID${id}`);
        //orderを格納し、focus=1へ
        $.ajax({
          url: '/tabPostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            flg: 'clickTab',
            id,
            order,
            title: file.title,
          }),
          success: function (res) {
            document.getElementById('notepass').innerHTML = pass;
            tabFocusID = id;
          },
        });
      },
    });
  });
};

//ページを更新した際に前回のタブ情報を載せる
function tabUpload() {
  $.ajax({
    url: '/tabPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'tabDesc',
    }),
    success: async function (res) {
      const createTheFirstTab = async () => {
        for (const tab of res.tabResult) {
          await titleClick(tab.id, tab.tabTitle);
        }
      };
      const tabFocusOn = async () => {
        if (res.tabResult.length != 0) {
          await $.ajax({
            url: '/tabPostController/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              flg: 'focusTab',
            }),
            success: function (res) {
              $(`#tab-ID${res.tabResult.id}`).trigger('click');
              tabFocusID = res.tabResult.id;
            },
          });
        }
      };
      await createTheFirstTab();
      await tabFocusOn();
      for (let i = 0; i < 20; i++) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const image = document.createElement('img');
        image.src = '../img/ringnote_w.gif';
        image.alt = 'Image';

        imageContainer.appendChild(image);
        document.getElementById('tab').appendChild(imageContainer);
      }
    },
  });
}

async function titleClick(id, title) {
  return new Promise((resolve, reject) => {
    //タブ未生成
    if (!tabIdArray.includes(id)) {
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
          resolve();
          const [inputEdit, div, textarea, fadeFont, inputShare, buttonTab] =
            tabCreate(id, title, res.fileResult);

          labelContextmenu();

          document.getElementById('notab').style.display = 'none';

          tabIdArray.push(id);
          //「編集する」ボタンクリック
          inputEdit.onclick = function () {
            let p1 = document.createElement('p');
            p1.innerHTML =
              '※現在編集中です。編集完了後【保存する】ボタンを押してください';
            div.appendChild(p1);
            textarea.readOnly = false;
            let titletext = document.createElement('input');
            titletext.setAttribute(
              'value',
              document.getElementById(`tabP${id}`).innerHTML
            );
            document.getElementById(`tabP${id}`).after(titletext);
            document.getElementById(`tabP${id}`).style.display = 'none';

            let inputKeep = document.createElement('input');
            let inputCancel = document.createElement('input');
            inputKeep.type = 'submit';
            inputKeep.value = '保存する';
            inputCancel.type = 'submit';
            inputCancel.value = '取り消す';
            inputKeep.setAttribute('class', 'keepbtn');
            inputCancel.setAttribute('class', 'cancelbtn');

            div.appendChild(inputKeep);
            div.appendChild(inputCancel);

            inputEdit.style.display = 'none';

            // const beforeElement = tabLabel.querySelector('::before');
            // beforeElement.style.backgroundColor = getRandomColor();

            //[保存する]ボタン押下
            inputKeep.onclick = () => {
              keepButton(
                id,
                textarea,
                p1,
                fadeFont,
                inputKeep,
                inputCancel,
                inputEdit,
                titletext.value,
                titletext
              );
            };
            //[取り消す]ボタン押下
            inputCancel.onclick = () => {
              cancelButton(
                id,
                p1,
                inputKeep,
                inputCancel,
                inputEdit,
                textarea,
                titletext
              );
            };
          };

          inputShare.onclick = () => {
            shareButton(id);
          };

          //タブ上の「✖️」ボタン押下
          buttonTab.onclick = () => {
            closeButton(id, title, tabIdArray);
            tabIdArray = deleteTabArray(id, tabIdArray);
          };

          //タブをクリックした際の処理
          document.getElementById(`tab-ID${id}`).onclick = (e) => {
            tabClick(e, id, title);
            tabFocusID = id;
          };
        },
      });
      //既にタブが生成されている場合
    } else {
      //タブをクリックしたことにする
      $(`#tab-ID${id}`).trigger('click');
    }
  });
}

//rootの右クリックから「フォルダ新規作成」押下
document.getElementById('newfolder').onclick = async (e) => {
  const id = 0;
  e.stopPropagation();
  await newFolderCreateFunc(id);
};

//rootの右クリックから「ファイル新規作成」押下
document.getElementById('newfile').onclick = async (e) => {
  const id = 0;
  e.stopPropagation();
  await newFileCreateFunc(id);
};

//「フォルダ追加」ボタン押下時(root(id=0)に作成)
createbutton.addEventListener(
  'click',
  async (e) => {
    const root = hasInput(document.getElementById('0'));
    if (!root) {
      const id = 0;
      e.stopPropagation();
      await newFolderCreateFunc(id);
    }
  },
  false
);

//「ノート追加」ボタン押下時(root(id=0)に作成)
// hasInputは、input要素の有無を確認している
createfilebutton.addEventListener('click', async (e) => {
  const root = hasInput(document.getElementById('0'));
  if (!root) {
    const id = 0;
    e.stopPropagation();
    //awaitはPromiseが返ってくるまで待つ。関数内でPromise化し、resolveのタイミングでPromiseが返る
    await newFileCreateFunc(id);
  }
});

//[全削除]ボタン押下時。ノートフォルダタブ全て削除
$('.container-delete').click(function () {
  let btn = confirm('ノートやフォルダが全て削除されますが本当に削除しますか？');
  //はいを押した場合(true)
  if (btn) {
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

//elemの全ての配下要素を再起的に参照。inputタブが配下にあればtrue,なければfalse
function hasInput(elem) {
  if (elem.tagName === 'INPUT') {
    return true;
  } else if (elem.children.length > 0) {
    for (let i = 0; i < elem.children.length; i++) {
      if (hasInput(elem.children[i])) {
        return true;
      }
    }
  }
  return false;
}

export function tabFocusIDGet() {
  return tabFocusID;
}
