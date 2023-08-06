import {
  orderGet,
  passGet,
  classNameGet,
  fileIDUnderTheFolder,
} from './stringUtils.js';

import { tabFocusIDGet, hashedIdGet } from './main.js';

export const jQueryUIOptionsFunc = () => {
  return new Promise((resolve, reject) => {
    let beforeOrder; //D&D前の順番
    let className; //順番(oderGet)を取得するために
    let parent_id_Tmp;
    let tmpArray = []; //配下のフォルダの子要素を入れるやつ？必要？？
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
          let str = item.prevObject[0].id;
          const regex = /[^0-9]/g;
          let id = str.replace(regex, '');

          className = classNameGet(document.getElementById(item[0].id));
          beforeOrder = orderGet(className, item[0].id);

          parent_id_Tmp = item[0].parentNode.id;
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
              tmpArray = res.response;
            },
          });
          //フォルダの子ノートを全て取得する(passの更新に使用するため)
          $.ajax({
            url: '/mypage/' + hashedIdGet,
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              flg: 'noteChild',
              id,
            }),
            success: function (res) {},
          });
        },
        //自分のfolder配下にはD&Dをできないようにしている
        //item:D＆Dの自分自身    container:ドラッグ先の要素
        isValidTarget: function (item, container) {
          let id = item.prevObject[0].getAttribute('value');
          let b = container.el[0].classList[0];

          id = Number(id);
          tmpArray.push(id); //自分自身のidを追加
          //class名の"f_160"とかの数字のみを取り出している
          const regex = /[^0-9]/g;
          const result = b.replace(regex, '');
          let a = Number(result);

          //tmpArray:子要素以下のid格納した配列
          //true: D&D可能　　false:D&D不可
          if (tmpArray.includes(a) == true) {
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

          //*****************************ファイル移動の場合**********************************
          if (item.prevObject[0].className.indexOf('file') != -1) {
            //移動後も同じparent_id
            if (parent_id_Tmp == item[0].parentNode.id) {
              //同じparent_id内でD＆D後の順番
              let afterOrder = orderGet(className, item[0].id);

              //現在いる場所より下へD＆D
              if (beforeOrder < afterOrder) {
                let id = item[0].childNodes[0].getAttribute('value');

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
                    order: afterOrder,
                  }),
                  success: function (res) {},
                });
                //現在いる場所より上へD＆D
              } else if (beforeOrder > afterOrder) {
                let id = item[0].childNodes[0].getAttribute('value');

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
                    order: afterOrder,
                  }),
                  success: function (res) {
                    reapplyTreeViewStyles();
                  },
                });
              } else {
                console.log('順番は変化していません');
              }
              //D&D後は違うフォルダ(parent_id)へ移動した時
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              let id = item[0].childNodes[0].getAttribute('value');

              $.ajax({
                url: '/notePostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  flg: 'parentIDDiffer',
                  parent_id: item[0].parentNode.id,
                  old_parent_id: parent_id_Tmp,
                  id,
                  old_order: beforeOrder,
                }),
                success: function (res) {
                  item[0].classList.replace(
                    `parent${parent_id_Tmp}`,
                    `parent${item[0].parentNode.id}`
                  );

                  className = classNameGet(document.getElementById(item[0].id));
                  let afterOrder = orderGet(className, item[0].id);

                  const pass = passGet(id, item[0].childNodes[0].innerHTML);

                  $.ajax({
                    url: '/mypage/' + hashedIdGet,
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      flg: 'addOrder',
                      id,
                      parent_id: item[0].parentNode.id,
                      order: afterOrder,
                      pattern: 'file',
                    }),
                    success: function (res) {
                      //passの取得
                      const focusId = tabFocusIDGet();
                      if (Number(id) === focusId) {
                        $(`#tab-ID${id}`).trigger('click');
                      }
                      reapplyTreeViewStyles();
                    },
                  });
                },
              });
            }
            //*************************フォルダ移動の場合******************************
          } else {
            //移動後も同じparent_id
            if (parent_id_Tmp == item[0].parentNode.id) {
              let afterOrder = orderGet(className, item[0].id);
              //orderが大きくなる場合(下へD＆D);
              if (beforeOrder < afterOrder) {
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: afterOrder,
                    move: 'down',
                  }),
                  success: function (res) {},
                });
                //orderが小さくなる場合(上へD＆D)
              } else if (beforeOrder > afterOrder) {
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: afterOrder,
                    move: 'up',
                  }),
                  success: function (res) {},
                });
              } else {
                console.log('順番は変化していません');
              }
              //D&D後は違うフォルダ(parent_id)へ移動した時
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              //D&D後に新しく追加された側のorderの動き
              $.ajax({
                url: '/folderPostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  flg: 'parentIDDiffer',
                  parent_id: item[0].parentNode.id,
                  old_parent_id: parent_id_Tmp,
                  id,
                  old_order: beforeOrder,
                }),
                success: function (res) {
                  item[0].classList.replace(
                    `parent${parent_id_Tmp}`,
                    `parent${item[0].parentNode.id}`
                  );

                  //D&D後の順番を取得
                  className = classNameGet(document.getElementById(item[0].id));
                  let afterOrder = orderGet(className, item[0].id);

                  //フォルダのD&D時に、タブのフォーカスが当たっているファイルが配下にあればパスを変更する(対象のタブをクリックする)
                  const fileUnder = fileIDUnderTheFolder(item[0].parentNode);
                  const tabFocusID = tabFocusIDGet();
                  if (fileUnder.includes(tabFocusID)) {
                    $(`#tab-ID${tabFocusID}`).trigger('click');
                  }

                  $.ajax({
                    url: '/mypage/' + hashedIdGet,
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      flg: 'addOrder',
                      id,
                      parent_id: item[0].parentNode.id,
                      order: afterOrder,
                      pattern: 'folder',
                    }),
                    success: function (res) {},
                  });
                },
              });
            }
          }
        },
      });
    });
  });
};

function reapplyTreeViewStyles() {
  console.log('zikkousaremaist');
  const treeviewElements = document.querySelectorAll('.treeview');
  treeviewElements.forEach(function (treeview) {
    treeview.classList.remove('treeview'); // クラスを一旦削除
    void treeview.offsetWidth; // リフローを発生させてブラウザにスタイルの再適用を強制
    treeview.classList.add('treeview'); // クラスを再適用
  });
}
