import { orderGet, passGet, classNameGet } from './stringUtils.js';

export const jQueryUIOptionsFunc = () => {
  return new Promise((resolve, reject) => {
    let beforeOrder; //D&D前の順番
    let className; //順番(oderGet)を取得するために
    let parent_id_Tmp;
    let tmpArray = [];
    $(function () {
      $('#0').treeview({
        animated: 'fast',
        collapsed: true,
        control: '.treecontrol',
      });
      resolve();
      $('#0').sortable({
        delay: 500,
        onDragStart: function (item) {
          let str = item.prevObject[0].id;
          const regex = /[^0-9]/g;
          let id = str.replace(regex, '');

          className = classNameGet(document.getElementById(item[0].id));
          beforeOrder = orderGet(className, item[0].id);

          parent_id_Tmp = item[0].parentNode.id;
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'folderChild',
              id,
            }),
            success: function (res) {
              console.log(`配下のフォルダの子要素は ${res.response}`);
              tmpArray = res.response;
            },
          });
          //フォルダの子ノートを全て取得する(passの更新に使用するため)
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'noteChild',
              id,
            }),
            success: function (res) {
              console.log(`配下のファイルの子要素は ${res.response}`);
            },
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
          let a = item[0].parentNode;
          let i = 0;
          //treeview(root)までの階層を調べる
          while (!a.classList.contains('treeview')) {
            a = a.parentNode;
            i++;
          }

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

              //下へD＆D
              if (beforeOrder < afterOrder) {
                console.log('ファイル:下へD&D');
                let id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/notePostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'note',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'down',
                    order: afterOrder,
                  }),
                  success: function (res) {},
                });
                //上へD＆D
              } else if (beforeOrder > afterOrder) {
                console.log('ファイル:上へD&D');
                let id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/notePostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'note',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'up',
                    order: afterOrder,
                  }),
                  success: function (res) {},
                });
              } else {
                console.log('順番は変化していません');
              }
              //移動後は違うparent_id
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              console.log('ファイル:違うParentID');
              let id = item[0].childNodes[0].getAttribute('value');

              $.ajax({
                url: '/notePostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'note',
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

                  //パス更新
                  const pass = passGet(id, item[0].childNodes[0].innerHTML);

                  $.ajax({
                    url: '/mypage/',
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      data: 'addOrder',
                      id,
                      parent_id: item[0].parentNode.id,
                      order: afterOrder,
                      pattern: 'file',
                    }),
                    success: function (res) {
                      //passを正しく表示する2点セット
                      //1.focusが当たってたらパス更新
                      if (res.response2 !== undefined && res.response2 == 1) {
                        document.getElementById('notepass').innerHTML = pass;
                      }
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
                console.log('フォルダ:下へD&D');
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'folder',
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
                console.log('フォルダ:上へD&D');
                $.ajax({
                  url: '/folderPostController/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'folder',
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
              //移動後は違うparent_id
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              console.log('フォルダ:違うParentID');
              //D&D後に新しく追加された側のorderの動き
              $.ajax({
                url: '/folderPostController/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'folder',
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

                  $.ajax({
                    url: '/mypage/',
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      data: 'addOrder',
                      id: id,
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
