import {
  keepButtonClick,
  cancelButtonClick,
  shareButtonClick,
  closeButton,
  tabClick,
  deleteTabArray,
  tabCreate,
  binderCreate,
} from './tab_func.js';
import { fileContextmenu } from './contextmenu/note_contextmenu.js';
import { folderContextmenu } from './contextmenu/folder_contextmenu.js';
import { shareContextmenu } from './contextmenu/share_contextmenu.js';
import { labelContextmenu } from './contextmenu/label_contextmenu.js';
import { jQueryUIOptionsFunc } from './jQueryUI_func.js';
import { orderGet, passGet } from './stringUtils.js';
import { expandableAdaptation } from './expandableOptions.js';
import { backgroundColorSet, backgroundColorDelete } from './menu.js';
import { enableElements, allowDragAndDropOfFiles, allowDragAndDropOfFolders } from './utilityFunction.js';

let tabIdArray = []; //タブが生成されているファイルのIDを格納
let tabFocusID; //　フォーカスが当たっているタブのIDを常に保持。フォルダ名の名前変更・D&D時のパス変更に使用。
let hashedId = document.getElementById('user_name').dataset.hashedId; // data属性から取得

export const listCreate = () => {
  $.ajax({
    url: '/mypage/' + hashedId,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'list',
    }),
    success: async (res) => {
      if (res.status === 500) {
        console.log('ログイン画面に戻ります');
        location.href = 'https://nodejs-itnote-app.herokuapp.com';
      }
      backgroundColorDelete();
      backgroundColorSet(res.user.BackgroundColor);

      document.getElementById('list_loader').style.display = 'none';
      document.getElementById('tab_loader').style.display = 'none';
      document.getElementById('user_name').innerHTML = res.userName;

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
                span.setAttribute(
                  'class',
                  `folder folder-${res.user.BackgroundColor}`
                );
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
                span.setAttribute(
                  'class',
                  `list_title file file-${res.user.BackgroundColor}`
                );
                span.setAttribute('id', `file${file.id}`);
                span.style.color = file.title_color;
                span.setAttribute('value', `${file.id}`);
                span.innerHTML = file.title;
                span.draggable = true;
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
      enableElements();
       allowDragAndDropOfFiles();
       allowDragAndDropOfFolders();

      // $(function () {
      //   $('.file').on('mousedown', function (e) {
      //     const $clone = $(this).clone();
      //     $clone.css('position', 'absolute');
      //     $clone.css('background-color', 'white');
      //     // ゴーストエフェクト要素をbodyに追加
      //     $('body').append($clone);

      //     // ドラッグ中の動作を設定
      //     $(document).on('mousemove', function (e) {
      //       // ゴーストエフェクトをドラッグに追従させる
      //       $clone.css('left', e.pageX + 'px');
      //       $clone.css('top', e.pageY + 'px');
      //     });

      //     // ドラッグ終了時の処理を設定
      //     $(document).on('mouseup', function (e) {
      //       // ゴーストエフェクト要素を削除
      //       $clone.remove();

      //       // 不要なイベントハンドラを解除
      //       $(document).off('mousemove');
      //       $(document).off('mouseup');
      //     });
      //   });
      // });
      // $(function () {
      //   $('.folder').on('mousedown', function (e) {
      //     const $clone = $(this).clone();
      //     $clone.css('position', 'absolute');
      //     $clone.css('background-color', 'white');
      //     // ゴーストエフェクト要素をbodyに追加
      //     $('body').append($clone);

      //     // ドラッグ中の動作を設定
      //     $(document).on('mousemove', function (e) {
      //       // ゴーストエフェクトをドラッグに追従させる
      //       $clone.css('left', e.pageX + 'px');
      //       $clone.css('top', e.pageY + 'px');
      //     });

      //     // ドラッグ終了時の処理を設定
      //     $(document).on('mouseup', function (e) {
      //       // ゴーストエフェクト要素を削除
      //       $clone.remove();

      //       // 不要なイベントハンドラを解除
      //       $(document).off('mousemove');
      //       $(document).off('mouseup');
      //     });
      //   });
      // });
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

const noTab = document.createElement('p');
noTab.innerHTML = 'こちらにnoteが出力されます';
noTab.setAttribute('id', 'notab');
document.getElementById('tab').appendChild(noTab);

export const fileClick = () => {
  let isClickEnabled = true; // クリックイベントの有効/無効フラグ

  // クリックイベントの定義
  function handleClick(event) {
    if (!isClickEnabled) {
      return; // クリックイベントが無効化されている場合は処理を終了
    }

    isClickEnabled = false;

    let file = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };
    let id = Number(file.id);
    tabScreenOptions(id, file.title);
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
      complete: function () {
        isClickEnabled = true; // クリックイベントを有効化
      },
    });
  }
  // 初回のクリックイベントの設定
  $('.list_title').on('click touchstart', handleClick);
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
          await tabScreenOptions(tab.id, tab.tabTitle);
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
      document.getElementById('reload_loader').classList.add('loaded');
    },
  });
}

async function tabScreenOptions(id, title) {
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
          tabCreate(id, title, res.fileResult);

          labelContextmenu();

          //一度全てのバインダーリングを削除し、再構築
          const elementsArray = Array.from(
            document.getElementsByClassName('image-container')
          );
          elementsArray.forEach((element) => {
            element.remove();
          });
          binderCreate();

          document.getElementById('notab').style.display = 'none';

          tabIdArray.push(id);

          document.getElementById(`edit-note-btn${id}`).onclick = function () {
            document.getElementById(`tabname${id}`).style.color = 'red';

            document.getElementById(`fade${id}`).style.opacity = '1';
            document.getElementById(`fade${id}`).style.color = 'red';
            document.getElementById(`fade${id}`).textContent =
              '※編集完了後【保存する】ボタンを押してください';

            document.getElementById(`share-button-${id}`).style.display =
              'none';
            document.getElementById(`textarea${id}`).readOnly = false;

            document.getElementById(`tabP${id}`).style.display = 'none';
            document.getElementById(`titletext${id}`).style.display = 'block';
            document
              .getElementById(`titletext${id}`)
              .setAttribute(
                'value',
                document.getElementById(`tabP${id}`).innerHTML
              );

            document.getElementById(`edit-note-btn${id}`).style.display =
              'none';

            document.getElementById(`keep-note-btn${id}`).style.display =
              'inline-block';
            document.getElementById(`cancel-note-btn${id}`).style.display =
              'inline-block';

            document
              .getElementById(`keep-note-btn${id}`)
              .addEventListener('click', () => {
                keepButtonClick(id);
                document.getElementById(`tabname${id}`).style.color = 'black';
              });

            document
              .getElementById(`cancel-note-btn${id}`)
              .addEventListener('click', () => {
                cancelButtonClick(id);
                document.getElementById(`tabname${id}`).style.color = 'black';
              });
          };

          document.getElementById(`share-button-${id}`).onclick = (event) => {
            shareButtonClick(id, event);
          };

          //タブ上の「✖️」ボタン押下
          document.getElementById(`button${id}`).onclick = () => {
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

export function tabFocusIDGet() {
  return tabFocusID;
}

export function hashedIdGet() {
  return hashedId;
}

document.getElementById("idInput").addEventListener("input", ()=>{
 // 入力値からハイフンを削除
  const id = document.getElementById("idInput").value.replace(/-/g, '');

  // 4桁ごとにハイフンを挿入
  let formattedID = '';
  for (let i = 0; i < id.length; i += 4) {
    formattedID += id.substr(i, 4);
    if (i + 4 < id.length) {
      formattedID += '-';
    }
  }
  // フォーマットされたIDを表示
  document.getElementById("idInput").value = formattedID;
});
