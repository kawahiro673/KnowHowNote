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

import { newFileCreateFunc, newCreateFile2 } from './newFileCreate.js';
import { newFolderCreateFunc } from './newFolderCreate.js';

import { orderGet } from './stringUtils.js';

var tabArray = []; //tab生成時にidを配列へ格納
let fileFlg = false;
let folderFlg = false;

export const listCreate = () => {
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'list',
    }),
    success: function (res) {
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
      jQueryUIOptionsFunc(); //jQueryUIを付与
      fileContextmenu(tabArray); //ファイルの右クリックメニュー
      folderContextmenu(tabArray, fileFlg, folderFlg); //フォルダーの右クリックメニュー
      fileClick(); //メモクリック時のTab表示

      //時間差でclosedのoffを開く＆フォルダ押下のclick関数作成
      window.setTimeout(function () {
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
                console.log(res.response);
              },
            });
          });
        }
      }, 300);
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
    //console.log(`"${listTitle.title}"がクリックされました。`);
    let ID = Number(listTitle.id);
    titleClick(ID, listTitle.title);
    let pass = passGet(listTitle.id, listTitle.title);
    //id((主キー)が同じ場合は更新してくれる(既にtab_holdに格納時みの場合)
    $.ajax({
      url: '/tabPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabAdd',
        id: ID,
        title: listTitle.title,
        pass,
      }),
      success: function (res) {
        let index = orderGet('tab-content', `Tab-ID${ID}`);
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
            order: index,
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
      for (const tab of res.response) {
        await titleClick(tab.id, tab.tabTitle);
      }
      if (res.response.length != 0) {
        setTimeout(() => {
          $.ajax({
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
        }, 500);
      }
    },
  });
}

//*********** タブ生成関数(ページリロード時) ************
async function titleClick(id, title) {
  return new Promise((resolve, reject) => {
    //タブ生成しておらず、・・・じゃないとき
    if (tabArray.includes(id) == false) {
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

          tabArray.push(id);
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
            closeButton(id, title, tabArray);
            tabArray = deleteTabArray(id, tabArray);
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

//右クリックから「フォルダ新規作成」押下
document.getElementById('newfolder').onclick = function (e) {
  e.stopPropagation();
  newFolderCreateFunc(0, folderFlg, fileFlg, tabArray);
};
//右クリックから「ファイル新規作成」押下
document.getElementById('newfile').onclick = function (e) {
  e.stopPropagation();
  newFileCreateFunc(0, fileFlg, tabArray);
};

//「フォルダ追加」ボタン押下時(rootに作成)
createbutton.addEventListener(
  'click',
  (e) => {
    if (!folderFlg) {
      e.stopPropagation();
      folderFlg = true;
      newFolderCreateFunc(0, folderFlg, fileFlg, tabArray);
    }
  },
  false
);

//「ノート追加」ボタン押下時(rootに作成)
createfilebutton.addEventListener(
  'click',
  (e) => {
    if (!fileFlg) {
      e.stopPropagation();
      const [inputTab, span] = newFileCreateFunc(0, fileFlg, tabArray);
      fileFlg = true;
      //左クリック
      const clickL = function (e) {
        e.preventDefault();
        if (fileFlg && !e.target.closest('#inputTab')) {
          newCreateFile2(inputTab, span, 0, tabArray);
          document.removeEventListener('click', clickL);
          document.removeEventListener('contextmenu', clickR);
          document.removeEventListener('keypress', enter);
          fileFlg = false;
        }
        //addEnentLisnterが残る!?ので削除する。
        // if (fileFlg === false) {
        //   document.removeEventListener('click', clickL);
        //   document.removeEventListener('contextmenu', clickR);
        //   document.removeEventListener('keypress', enter);
        // }
      };

      //右クリック
      const clickR = function (e) {
        e.preventDefault();
        if (fileFlg && !e.target.closest('#inputTab')) {
          newCreateFile2(inputTab, span, 0, tabArray);
          document.removeEventListener('click', clickL);
          document.removeEventListener('contextmenu', clickR);
          document.removeEventListener('keypress', enter);
          fileFlg = false;
        }
        // if (fileFlg === false) {
        //   document.removeEventListener('click', clickL);
        //   document.removeEventListener('contextmenu', clickR);
        //   document.removeEventListener('keypress', enter);
        }
      };
      //エンター押下時
      const enter = function (e) {
        //e.preventDefault(); //これがあると入力できない？？
        if (fileFlg) {
          if (e.keyCode === 13) {
            newCreateFile2(inputTab, span, 0, tabArray);
            document.removeEventListener('click', clickL);
            document.removeEventListener('contextmenu', clickR);
            document.removeEventListener('keypress', enter);
            fileFlg = false;
          }
        }
        // if (fileFlg === false) {
        //   document.removeEventListener('click', clickL);
        //   document.removeEventListener('contextmenu', clickR);
        //   document.removeEventListener('keypress', enter);
        // }
      };
      //右・左・Enterそれぞれの実行
      document.addEventListener('click', clickL);
      document.addEventListener('contextmenu', clickR);
      inputTab.addEventListener('keypress', enter);
    }
  },
  false
);

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
