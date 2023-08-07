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
    let elementsBeforeMoving;
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
          //ドラッグアンドドロップ前の要素群を取得するため
          if (item[0].parentNode.firstElementChild) {
            elementsBeforeMoving = item[0].parentNode.firstElementChild;
          }
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

          //*******************************************************************************
          //*****************************ファイル移動の場合**********************************
          //*******************************************************************************
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
                  success: function (res) {
                    updateLastClasses_file(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                  },
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
                    updateLastClasses_file(item[0]);
                    addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
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
                      updateLastClasses_file(item[0]);
                      addLastClassToLastSibling(elementsBeforeMoving);
                      removeLastHitareaClasses(item[0]);
                    },
                  });
                },
              });
            }
            //********************************************************************************
            //*******************************フォルダ移動の場合*********************************
            //********************************************************************************
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
                  success: function (res) {
                    updateLastClasses_Folder(item[0]);
                     addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                  },
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
                  success: function (res) {
                     updateLastClasses_Folder(item[0]);
                     addLastClassToLastSibling(elementsBeforeMoving);
                    removeLastHitareaClasses(item[0]);
                    removeLastHitareaClasses_this(item[0]);
                  },
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
                    success: function (res) {
                       updateLastClasses_Folder(item[0]);
                       addLastClassToLastSibling(elementsBeforeMoving);
                      removeLastHitareaClasses(item[0]);
                    },
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

//ドラッグアンドドロップ後parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
//①関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下にある時に、要素のクラスにlastを追加し、要素A以外の同階層の兄弟要素に
// 「last」または「lastCollapsable」または「lastExpandable」というクラスがあれば、そのクラスを削除
//②関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下でない場合、その要素の クラスに「last」があれば「last」を削除
// function updateLastClasses_file(element) {
//   const siblings = element.parentNode.children;
//   const isLastChild = element === siblings[siblings.length - 1];

//   for (const sibling of siblings) {
//     if (sibling !== element) {
//       if (sibling.classList.contains('last') || sibling.classList.contains('lastCollapsable') || sibling.classList.contains('lastExpandable')) {
//         sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
//       }
//     }
//   }

//   if (isLastChild) {
//     if (element.classList.contains('collapsable')) {
//       element.classList.remove('lastExpandable');
//       element.classList.remove('last');
//       element.classList.add('lastCollapsable'); // ① 要素が一番下で collapsable クラスを持つ場合、lastCollapsable クラスを追加
//     } else if (element.classList.contains('expandable')) {
//       element.classList.remove('lastCollapsable');
//       element.classList.remove('last');
//       element.classList.add('lastExpandable'); // ① 要素が一番下で expandable クラスを持つ場合、lastExpandable クラスを追加
//     } else {
//       element.classList.remove('lastCollapsable', 'lastExpandable');
//       element.classList.add('last'); // ① 要素が一番下でない場合、last クラスを追加
//     }
//   } else if (element.classList.contains('last')) {
//     element.classList.remove('last'); // ② 要素が一番下でなく、last クラスを持つ場合、last クラスを削除
//   }
// }

function updateLastClasses_file(element) {
  const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  for (const sibling of siblings) {
    if (sibling !== element) {
      if (sibling.classList.contains('last') || sibling.classList.contains('lastCollapsable') || sibling.classList.contains('lastExpandable')) {
        sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
      }
    }
  }

  if (lastSibling === element) {
    element.classList.remove('last', 'lastCollapsable', 'lastExpandable');
    if (element.classList.contains('collapsable')) {
      element.classList.add('lastCollapsable');
    } else if (element.classList.contains('expandable')) {
      element.classList.add('lastExpandable');
    } else {
      element.classList.add('last');
    }
  } else {
    element.classList.remove('last');
    if (lastSibling) {
      lastSibling.classList.add('last');
      if (lastSibling.classList.contains('collapsable')) {
        lastSibling.classList.add('lastCollapsable');
        lastSibling.classList.remove('lastExpandable');
      } else if (lastSibling.classList.contains('expandable')) {
        lastSibling.classList.add('lastExpandable');
        lastSibling.classList.remove('lastCollapsable');
      } else {
        lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
      }
    }
  }
}

//ドラッグアンドドロップ後parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
//①関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下にある時に、要素のクラスに「collapsable」がある場合は、「lastCollapsable」を追加し、「expandable」がある場合は、「lastExpandable」を追加
//  そして要素A以外の同階層の兄弟要素に「last」または「lastCollapsable」または「lastExpandable」というクラスがあれば、そのクラスを削除
//②関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下でない場合、その要素の クラスに「lastCollapsable」や「lastExpandable」があれば削除
// function updateLastClasses_Folder(element) {
//   const siblings = element.parentNode.children;
//   const isLastChild = element === siblings[siblings.length - 1];

//   for (const sibling of siblings) {
//     if (sibling !== element) {
//       if (sibling.classList.contains('last') || sibling.classList.contains('lastCollapsable') || sibling.classList.contains('lastExpandable')) {
//         sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
//       }
//     }
//   }

//   if (isLastChild) {
//     if (element.classList.contains('collapsable')) {
//       element.classList.remove('lastExpandable');
//       element.classList.remove('last');
//       element.classList.add('lastCollapsable'); // ① 要素が一番下で collapsable クラスを持つ場合、lastCollapsable クラスを追加
//     } else if (element.classList.contains('expandable')) {
//       element.classList.remove('lastCollapsable');
//       element.classList.remove('last');
//       element.classList.add('lastExpandable'); // ① 要素が一番下で expandable クラスを持つ場合、lastExpandable クラスを追加
//     } else {
//       element.classList.remove('lastCollapsable', 'lastExpandable');
//       element.classList.add('last'); // ① 要素が一番下でない場合、last クラスを追加
//     }
//   } else {
//     element.classList.remove('lastCollapsable', 'lastExpandable'); // ② 要素が一番下でない場合、lastCollapsable と lastExpandable クラスを削除
//   }
// }

function updateLastClasses_Folder(element) {
 const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  for (const sibling of siblings) {
    if (sibling !== element) {
      if (sibling.classList.contains('last') || sibling.classList.contains('lastCollapsable') || sibling.classList.contains('lastExpandable')) {
        sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
      }
    }
  }

  if (lastSibling === element) {
    element.classList.remove('last', 'lastCollapsable', 'lastExpandable');
    if (element.classList.contains('collapsable')) {
      element.classList.add('lastCollapsable');
    } else if (element.classList.contains('expandable')) {
      element.classList.add('lastExpandable');
    } else {
      element.classList.add('last');
    }
  } else {
    element.classList.remove('lastCollapsable', 'lastExpandable');
    if (lastSibling) {
      if (lastSibling.classList.contains('collapsable')) {
        lastSibling.classList.remove('last');
        lastSibling.classList.add('lastCollapsable');
      } else if (lastSibling.classList.contains('expandable')) {
        lastSibling.classList.remove('last');
        lastSibling.classList.add('lastExpandable');
      } else {
        lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
        lastSibling.classList.add('last');
      }
    }
  }
}

function updateLastClasses(element) {
  const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  for (const sibling of siblings) {
    if (sibling !== element) {
      if (sibling.classList.contains('last') || sibling.classList.contains('lastCollapsable') || sibling.classList.contains('lastExpandable')) {
        sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
      }
    }
  }

  if (lastSibling === element) {
    if (element.classList.contains('collapsable')) {
      element.classList.remove('lastExpandable');
      element.classList.remove('last');
      element.classList.add('lastCollapsable');
    } else if (element.classList.contains('expandable')) {
      element.classList.remove('lastCollapsable');
      element.classList.remove('last');
      element.classList.add('lastExpandable');
    } else {
      element.classList.remove('lastCollapsable', 'lastExpandable');
      element.classList.add('last');
    }
  } else {
    element.classList.remove('last');
    if (lastSibling) {
      lastSibling.classList.add('last');
      if (lastSibling.classList.contains('collapsable')) {
        lastSibling.classList.add('lastCollapsable');
        lastSibling.classList.remove('lastExpandable');
      } else if (lastSibling.classList.contains('expandable')) {
        lastSibling.classList.add('lastExpandable');
        lastSibling.classList.remove('lastCollapsable');
      } else {
        lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
      }
    }
  }
}

 //ドラッグアンドドロップ前parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
function addLastClassToLastSibling(element) {
    const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  if (lastSibling) {
    if (lastSibling.classList.contains('collapsable')) {
      lastSibling.classList.add('lastCollapsable');
      lastSibling.classList.remove('lastExpandable');
    } else if (lastSibling.classList.contains('expandable')) {
      lastSibling.classList.add('lastExpandable');
      lastSibling.classList.remove('lastCollapsable');
    } else {
      lastSibling.classList.add('last');
      lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
    }
  }
}

//関数が受け取った引数(要素)と同じ、同階層の兄弟要素の中で、クラス名「lastCollapsable-hitarea」と「lastExpandable-hitarea」クラスを削除
//上記のクラスがあることによって、D&D時に、「⊕」「⊖」が消えてしまう事がある
function removeLastHitareaClasses(element) {
  const siblings = element.parentNode.children;

  for (const sibling of siblings) {
    if (sibling !== element) {
      const hitarea = sibling.querySelector('.lastCollapsable-hitarea, .lastExpandable-hitarea');
      if (hitarea) {
        hitarea.classList.remove('lastCollapsable-hitarea', 'lastExpandable-hitarea');
      }
    }
  }
}

//自分自身の要素のクラス名「lastCollapsable-hitarea」と「lastExpandable-hitarea」クラスを削除
function removeLastHitareaClasses_this(element) {
  const hitareas = element.querySelectorAll('.lastCollapsable-hitarea, .lastExpandable-hitarea');
  
  for (const hitarea of hitareas) {
    hitarea.classList.remove('lastCollapsable-hitarea', 'lastExpandable-hitarea');
  }
}
