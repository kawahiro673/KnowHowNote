import {
  keepButton,
  cancelButton,
  shareButton,
  passGet,
  updateTime,
  closeTab,
  closeButton,
  tabClick,
  deleteTabArray,
  tabCreate,
} from './tab_func.js';

import { fileContextmenu } from './note_contextmenu.js';
import { folderContextmenu } from './folder_contextmenu.js';

import { jQueryUIOptionsFunc } from './jQueryUI_func.js';

import { newFileCreateFunc } from './newFileCreate.js';
import { newFolderCreateFunc } from './newFolderCreate.js';

import { orderGet } from './stringUtils.js';

var tabIdArray = []; //タブが生成されているファイルのIDを格納
let fileInputExistFlg = false; //ファイル作成時のInputタブが出力しているかの有無　true=有,false=無
let folderInputExistFlg = false; //↑のフォルダ版

export const listCreate = () => {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'list',
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
          //console.log('やあ' + parentId);
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
                li.setAttribute('id', `parent${folder.parent_id}`);
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
                let span = document.createElement('span');
                span.setAttribute('class', 'list_title file');
                span.setAttribute('id', `li${file.id}`);
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

      const expandableAdaptation = () => {
        //時間差でclosedのoffを開く＆フォルダ押下時にclick
        return new Promise((resolve, reject) => {
          expandableArray.forEach((ex) => {
            document.getElementById(`folder${ex}`).click();
          });

          let fol = document.getElementsByClassName('folder');
          for (let i = 0; i < fol.length; i++) {
            fol[i].addEventListener('click', function () {
              let closedFlg = 0;
              console.log(this.id.replace(/[^0-9]/g, ''));
              //folderが閉じているとflg=1
              if (this.parentNode.classList.contains('expandable')) {
                closedFlg = 1;
              }

              $.ajax({
                url: '/folderPostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'folder',
                  flg: 'closed',
                  id: this.id.replace(/[^0-9]/g, ''),
                  closedFlg,
                }),
                success: function (res) {
                  //console.log(res.response);
                },
              });
            });
          }
          resolve();
        });
      };

      await jQueryUIOptionsFunc();
      fileContextmenu(tabIdArray);
      folderContextmenu(tabIdArray, fileInputExistFlg, folderInputExistFlg);
      fileClick();
      await expandableAdaptation();
    },
  });
};

//「マイノウハウ」タブにファイル/フォルダ全て表示
//DBから全ての情報を取得

function shareListCreate() {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'sharelist',
    }),
    success: function (res) {
      res.response2.forEach((file) => {
        //要素作成
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.setAttribute('class', 'sharenote file');
        span.innerHTML = file.title;
        document.getElementById('sharelist').appendChild(li);
        li.appendChild(span);
      });
    },
  });
}

listCreate();
tabUpload();
shareListCreate();

let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');
$('#right').on('click contextmenu', (e) => {
  //ノート上で右クッリク
  if (e.target.closest('.list_title')) {
    conme.style.left = e.pageX + 'px';
    conme.style.top = e.pageY + 'px';
    conme.style.display = 'block';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
  } else if (e.target.closest('.folder')) {
    conme3.style.left = e.pageX + 'px';
    conme3.style.top = e.pageY + 'px';
    conme3.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme4.style.display = 'none';
  } else if (e.target.closest('.sharenote')) {
    conme4.style.left = e.pageX + 'px';
    conme4.style.top = e.pageY + 'px';
    conme4.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
  } else {
    conme2.style.left = e.pageX + 'px';
    conme2.style.top = e.pageY + 'px';
    conme2.style.display = 'block';
    conme.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
  }
  document.body.addEventListener('click', function (e) {
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
  });
});
$('html').on('click contextmenu', (e) => {
  let a = $(event.target).closest('#right').length;
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
    let listTitle = {
      title: $(this).html(),
      id: $(this).attr('value'),
      titleThis: this,
    };
    console.log(`"${listTitle.title}"がクリックされました。`);
    let ID = Number(listTitle.id);
    titleClick(ID, listTitle.title);
    const pass = passGet(listTitle.id, listTitle.title);
    let isSomething = tabIdArray.includes(ID);
    $.ajax({
      url: '/tabPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabAdd',
        isSomething,
        id: ID,
        title: listTitle.title,
        pass,
      }),
      success: function (res) {
        const order = orderGet('tab-content', `Tab-ID${ID}`);
        //orderを格納し、focus=1へ
        $.ajax({
          url: '/tabPostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'tab',
            flg: 'clickTab',
            id: ID,
            order,
            title: listTitle.title,
          }),
          success: function (res) {
            document.getElementById('notepass').innerHTML = pass;
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
      data: 'tab',
      flg: 'tabDesc',
    }),
    success: async function (res) {
      const createTheFirstTab = async () => {
        for (const tab of res.response) {
          await titleClick(tab.id, tab.tabTitle);
        }
      };
      const tabFocusOn = async () => {
        if (res.response.length != 0) {
          await $.ajax({
            url: '/tabPostController/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'tab',
              flg: 'focusTab',
            }),
            success: function (res) {
              $(`#tab-ID${res.response.id}`).trigger('click');
            },
          });
        }
      };
      await createTheFirstTab();
      await tabFocusOn();
    },
  });
}

//*********** タブ生成関数(ページリロード時) ************
async function titleClick(id, title) {
  return new Promise((resolve, reject) => {
    //タブ生成しておらず、・・・じゃないとき
    if (tabIdArray.includes(id) == false) {
      $.ajax({
        url: '/notePostController/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'note',
          flg: 'info',
          id,
        }),
        success: function (res) {
          resolve();
          const [
            inputEdit,
            div,
            textarea,
            fadeFont,
            time,
            inputShare,
            buttonTab,
          ] = tabCreate(id, title, res.response);

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
                time,
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

//フォルダの右クリックから「フォルダ新規作成」押下
document.getElementById('newfolder').onclick = (e) => {
  const id = 0;
  e.stopPropagation();
  newFolderCreateFunc(id, folderInputExistFlg, fileInputExistFlg, tabIdArray);
};

//フォルダの右クリックから「ファイル新規作成」押下
document.getElementById('newfile').onclick = (e) => {
  const id = 0;
  e.stopPropagation();
  newFileCreateFunc(id, fileInputExistFlg, tabIdArray);
};

//「フォルダ追加」ボタン押下時(root(id=0)に作成)
//folderInputExistFlg=true時はファイルを作らせない → 連続でボタンクリックした時にフォルダを２個同時に作らせないため
createbutton.addEventListener(
  'click',
  async (e) => {
    const root = hasInput(document.getElementById('0'));
    if (!folderInputExistFlg && !root) {
      const id = 0;
      e.stopPropagation();
      folderInputExistFlg = true;
      await newFolderCreateFunc(
        id,
        folderInputExistFlg,
        fileInputExistFlg,
        tabIdArray
      );
      folderInputExistFlg = false;
    }
  },
  false
);

//「ノート追加」ボタン押下時(root(id=0)に作成)
//fileInputExistFlg=true時はファイルを作らせない → 連続でボタンクリックした時にファイルを２個同時に作らせないため
// hasInputは、input要素の有無を確認している
createfilebutton.addEventListener('click', async (e) => {
  const root = hasInput(document.getElementById('0'));
  if (!fileInputExistFlg && !root) {
    const id = 0;
    e.stopPropagation();
    fileInputExistFlg = true;
    //awaitはPromiseが返ってくるまで待つ。関数内でPromise化し、resolveのタイミングでPromiseが返る
    await newFileCreateFunc(id, fileInputExistFlg, tabIdArray);
    fileInputExistFlg = false;
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
        data: 'deleteALL',
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

//[折り畳む]ボタン押下後、DB全て折り畳む値追加
$('.collapsable').click(function () {
  valuePassToServerOnly('/folderPostController/', 'folder', 'collapsableALL');
});

//[展開する]ボタン押下、DB全て展開する値追加
$('.expandable').click(function () {
  valuePassToServerOnly('/folderPostController/', 'folder', 'expandableALL');
});

$('.hamburger').click(() => {
  console.log('ハンバーガー押下');
  fetch('/mypage/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'humburger',
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // レスポンスを処理するコード
      alert(data.msg);
    })
    .catch((error) => {
      console.error(error);
      // エラー処理を行うコード
    });
});

//[ログアウト]押下後、サーバーでCookieを削除
document.getElementById('logout').addEventListener('click', () => {
  valuePassToServerOnly('/mypage/', 'cookiedelete');
});

//サーバーとのやり取りをするだけの関数(レスポンスなしが好ましい)
const valuePassToServerOnly = (url, str1, str2) => {
  $.ajax({
    url,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: str1,
      flg: str2,
    }),
    success: function (res) {},
  });
};

//elemの全ての配下要素を再起的に参照し、inputタブが配下にあればtrue,なければfalse
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
