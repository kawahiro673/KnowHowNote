import {
  orderGet,
  passGet,
  classNameGet,
  fileIDUnderTheFolder,
} from './stringUtils.js';

import { tabFocusIDGet, hashedIdGet } from './main.js';
import {
  updateLastClasses_file,
  updateLastClasses_Folder,
  addLastClassToLastSibling,
  removeLastHitareaClasses,
  removeLastHitareaClasses_this,
} from './treeviewLineUpdate.js';

export const jQueryUIOptionsFunc = () => {
  return new Promise((resolve, reject) => {
    let orderBeforeMoving; //ドラッグアンドドロップ前の順番
    let className;
    let tmpParentID;
    let childFolders = []; //配下のフォルダの子要素を入れるやつ？必要？？
    let elementsBeforeMoving; //リストの親子関係を見やすくする線を調整するため、移動前の要素を格納
    $(function () {
      $('#0').treeview({
        animated: 'fast',
        collapsed: true,
        control: '.treecontrol',
      });
      resolve();
      $('#0').sortable({
        delay: 500,
        tolerance: -10,
        onDragStart: function (item) {
          const id = item.prevObject[0].id.replace(/[^0-9]/g, '');
          //orderNameGetは同一のクラス名を対象に順番を取得する
          className = classNameGet(document.getElementById(item[0].id));
          orderBeforeMoving = orderGet(className, item[0].id);
          tmpParentID = item[0].parentNode.id;
          $.ajax({
            url: '/mypage/' + hashedIdGet,
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              flg: 'folderChild',
              id,
            }),
            success: function (res) {
              childFolders = res.response;
            },
          });
          //ドラッグアンドドロップ前の要素群を取得
          if (item[0].parentNode.firstElementChild) {
            elementsBeforeMoving = item[0].parentNode.firstElementChild;
          }
        },
        //自分自身の配下にはドラッグ&ドロップ不可にしている(folder)
        //item:D＆Dの自分自身    container:ドラッグ先の要素
        isValidTarget: function (item, container) {
          const id = Number(item.prevObject[0].getAttribute('value'));
          childFolders.push(id);
          //親folderのulのclass名"f_160"とかの数字のみを取り出している(これがParentIDとなる)
          const draggedFolderID = Number(
            container.el[0].classList[0].replace(/[^0-9]/g, '')
          );
          //true: D&D可能　　false:D&D不可
          if (childFolders.includes(draggedFolderID) == true) {
            return false;
          } else {
            return true;
          }
        },

        //ファイル・フォルダをD&D後の処理
        onDrop: function (item, container, _super, event) {
          let id = item.prevObject[0].getAttribute('value');

          //リストの+−ボタンを押下してもドラッグできるようにした(次の兄弟のspan要素を代入している)
          if (item.prevObject[0].classList.contains('hitarea')) {
            item.prevObject[0] = item.prevObject[0].nextElementSibling;
          }

          //*******************************************************************************
          //*****************************ファイル移動の場合**********************************
          //*******************************************************************************

          if (item.prevObject[0].className.indexOf('file') != -1) {
            //移動後も同じparent_id
            if (tmpParentID == item[0].parentNode.id) {
              //同じparent_id内でD＆D後の順番
              const orderAfterMoving = orderGet(className, item[0].id);

              //現在いる場所より下へD＆D
              if (orderBeforeMoving < orderAfterMoving) {
                const id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/notePostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'down',
                    order: orderAfterMoving,
                  }),
                  success: function (res) {
                    updateLastClasses_file(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                  },
                });
                //現在いる場所より上へD＆D
              } else if (orderBeforeMoving > orderAfterMoving) {
                const id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/notePostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'up',
                    order: orderAfterMoving,
                  }),
                  success: function (res) {
                    updateLastClasses_file(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                  },
                });
              } else {
                //順番は変化なし
              }
              //D&D後は違うフォルダへ移動した時
            } else if (tmpParentID != item[0].parentNode.id) {
              const id = item[0].childNodes[0].getAttribute('value');

              className = classNameGet(document.getElementById(item[0].id));
              const orderAfterMoving = orderGet(className, item[0].id);
              console.log(item[0].parentNode.id);
              console.log(tmpParentID);
              console.log(orderBeforeMoving);
              console.log(orderAfterMoving);
              $.ajax({
                url: '/notePostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  flg: 'parentIDDiffer',
                  newParentID: item[0].parentNode.id,
                  oldParentID: tmpParentID,
                  id,
                  oldOrder: orderBeforeMoving,
                  newOrder: orderAfterMoving,
                }),
                success: function (res) {
                  item[0].classList.replace(
                    `parent${tmpParentID}`,
                    `parent${item[0].parentNode.id}`
                  );
                  //フォルダのD&D時に、タブのフォーカスが当たっていればパスを変更する(対象のタブをクリックする)
                  if (Number(id) === tabFocusIDGet()) {
                    $(`#tab-ID${id}`).trigger('click');
                  }
                  updateLastClasses_file(item[0]);
                  addLastClassToLastSibling(elementsBeforeMoving);
                  removeLastHitareaClasses(item[0]);
                },
              });
            }
            //********************************************************************************
            //*******************************フォルダ移動の場合*********************************
            //********************************************************************************
          } else {
            //移動後も同じparent_id
            if (tmpParentID == item[0].parentNode.id) {
              let orderAfterMoving = orderGet(className, item[0].id);
              //orderが大きくなる場合(下へD＆D);
              if (orderBeforeMoving < orderAfterMoving) {
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: orderAfterMoving,
                    move: 'down',
                  }),
                  success: function (res) {
                    updateLastClasses_Folder(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                  },
                });
                //orderが小さくなる場合(上へD＆D)
              } else if (orderBeforeMoving > orderAfterMoving) {
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: orderAfterMoving,
                    move: 'up',
                  }),
                  success: function (res) {
                    updateLastClasses_Folder(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                    removeLastHitareaClasses_this(item[0]);
                  },
                });
              } else {
                //順番は変化なし
              }
              //D&D後は違うフォルダ(parent_id)へ移動した時
            } else if (tmpParentID != item[0].parentNode.id) {
              className = classNameGet(document.getElementById(item[0].id));
              const orderAfterMoving = orderGet(className, item[0].id);
              console.log(item[0].parentNode.id);
              console.log(tmpParentID);
              console.log(orderBeforeMoving);
              console.log(orderAfterMoving);
              $.ajax({
                url: '/folderPostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  flg: 'parentIDDiffer',
                  newParentID: item[0].parentNode.id,
                  oldParentID: tmpParentID,
                  id,
                  oldOrder: orderBeforeMoving,
                  newOrder: orderAfterMoving,
                }),
                success: function (res) {
                  item[0].classList.replace(
                    `parent${tmpParentID}`,
                    `parent${item[0].parentNode.id}`
                  );
                  //フォルダのD&D時に、タブのフォーカスが当たっているファイルが配下にあればパスを変更する(対象のタブをクリックする)
                  const fileUnder = fileIDUnderTheFolder(item[0].parentNode);
                  const tabFocusID = tabFocusIDGet();
                  if (fileUnder.includes(tabFocusID)) {
                    $(`#tab-ID${tabFocusID}`).trigger('click');
                  }

                  // $.ajax({
                  //   url: '/mypage/' + hashedIdGet,
                  //   type: 'POST',
                  //   dataType: 'Json',
                  //   contentType: 'application/json',
                  //   data: JSON.stringify({
                  //     flg: 'addOrder',
                  //     id,
                  //     parent_id: item[0].parentNode.id,
                  //     order: orderAfterMoving,
                  //     pattern: 'folder',
                  //   }),
                  //   success: function (res) {
                  updateLastClasses_Folder(item[0]);
                  addLastClassToLastSibling(elementsBeforeMoving);
                  removeLastHitareaClasses(item[0]);
                  removeLastHitareaClasses_this(item[0]);
                  //   },
                  // });
                },
              });
            }
          }
        },
      });
    });
  });
};
