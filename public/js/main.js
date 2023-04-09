import {
  keepButton,
  cancelButton,
  shareButton,
  passGet,
  updateTime,
  closeTab,
  closeButton,
  tabClick,
} from './tab_func.js';

let tab = document.getElementById('tab');
let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');
var idArray = []; //tab生成時にidを配列へ格納
let tabFocus;
let initial_index;
let parent_id_Tmp;
let list;
let tmpArray = [];
let fileFlg = false;
let folderFlg = false;

window.addEventListener('DOMContentLoaded', function () {
  //listの作成
  function listCreate() {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'list',
      }),
      success: function (res) {
        if (res.userName === 'NO User') {
          console.log('クリック！！');
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
                //for (const folder of res.response) {
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
                  //console.log(`${folder.folder_name}の要素を作成しました`);
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
        jQUI(); //jQueryUIを付与
        fileContextmenu(); //ファイルの右クリックメニュー
        folderContextmenu(); //フォルダーの右クリックメニュー
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
                url: '/mypage/',
                //async: false,
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
  }

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

  $('#right').on('click contextmenu', function (e) {
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
  $('html').on('click contextmenu', function (e) {
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

  function fileContextmenu() {
    $('.list_title').on('contextmenu', function () {
      console.log(
        `"${$(this).html()}" ${$(this).attr('value')} を右クリックしました`
      );
      let listTitle = {
        title: $(this).html(),
        id: $(this).attr('value'),
        titleThis: this,
      };

      listTitle.titleThis.style.backgroundColor = '#A7F1FF';
      listTitle.titleThis.style.borderRadius = '10px';

      let elements = document.getElementsByClassName(
        `parent${listTitle.titleThis.parentNode.parentNode.id}`
      );
      let index = [].slice
        .call(elements)
        .indexOf(listTitle.titleThis.parentNode);
      index++;
      // console.log(
      //   `id:${listTitle.id},title:${listTitle.title},order:${index},parent_id:${listTitle.titleThis.parentNode.parentNode.id}`
      // );
      //console.log(listTitle.titleThis);
      document.getElementById('delete').onclick = function () {
        var btn = confirm(`${listTitle.title} を本当に削除しますか？`);
        let tabelements = document.getElementsByClassName('tab-content');
        let tabId = document.getElementById(`Tab-ID${listTitle.id}`);
        let tabIndex = [].slice.call(tabelements).indexOf(tabId);

        //はいを押した場合(true)
        //まずはタブ削除
        if (btn) {
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'tab',
              flg: 'tabDel',
              id: listTitle.id,
              order: tabIndex,
            }),
            success: function (res) {
              //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？
              let parentid = listTitle.titleThis.parentNode.parentNode.id;
              $(`#li${listTitle.id}`).parent().remove();

              listTitle.id = Number(listTitle.id);
              if (idArray.includes(listTitle.id)) {
                closeTab(listTitle.id, tabIndex, tabFocus, idArray);
                //idArrayの中にあるlistTitle.idを削除
                idArray = idArray.filter((n) => n !== listTitle.id);
              }

              $.ajax({
                url: '/mypage/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'note',
                  flg: 'delete',
                  id: listTitle.id,
                  order: index,
                  parentId: parentid,
                }),
                success: function (res) {
                  console.log(`${res.response}を削除しました`);
                },
              });
            },
          });
        }
      };

      $(document).ready(function () {
        $('#name').off('click');
        $('#name').on('click', function (event) {
          console.log('nameをクリックしました');
          //テキストの作成
          const inputTab = document.createElement('input');
          inputTab.setAttribute('type', 'text');
          inputTab.setAttribute('id', 'inputTab');
          inputTab.setAttribute('name', 'list_title');
          inputTab.setAttribute('maxlength', '20');
          inputTab.setAttribute('size', '20');
          inputTab.style.display = 'block';
          inputTab.setAttribute('value', listTitle.title);

          listTitle.titleThis.after(inputTab);
          listTitle.titleThis.style.display = 'none';

          //テキストエリアにフォーカスを当ててカーソルを末尾へ
          let len = inputTab.value.length;
          document.getElementById('inputTab').focus();
          document.getElementById('inputTab').setSelectionRange(len, len);

          //Enter押下で変更する
          inputTab.addEventListener('keypress', function (e) {
            //Enter判定
            if (e.keyCode === 13) {
              //何も入力されていない時や空白や改行のみの入力
              if (!inputTab.value || !inputTab.value.match(/\S/g)) {
                alert('タイトルを入力してください');
              } else {
                //console.log(inputTab.value, listTitle.title);
                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'note',
                    flg: 'name',
                    id: listTitle.id,
                    title: inputTab.value,
                    oldTitle: listTitle.title, //変更前のタイトル
                  }),
                  success: function (res) {
                    //console.log(`success受信(title) : "${res.response1}"`);

                    listTitle.titleThis.style.display = 'block';
                    listTitle.titleThis.innerHTML = res.response1;
                    inputTab.remove();
                    //タブが生成済みの場合
                    if (res.response2 != undefined) {
                      //リアルタイムにタイトル更新
                      document.getElementById(
                        `tabname${listTitle.id}`
                      ).innerHTML = res.response1;

                      document.getElementById(`tabP${listTitle.id}`).innerHTML =
                        res.response1;

                      //passを正しく表示する2点セット
                      //1.focusが当たってたらパス更新
                      if (res.response3 == 1) {
                        document.getElementById('notepass').innerHTML =
                          res.response2;
                      }
                      //2.タブクリック時にパス更新
                      document.getElementById(`tab-ID${listTitle.id}`).onclick =
                        function (e) {
                          document.getElementById('notepass').innerHTML =
                            res.response2;
                        };
                    }
                  },
                });
              }
            }
          });
          tmp1 = inputTab;
          tmp2 = listTitle.titleThis;
          document.addEventListener('mousedown', eventFunc);
        });
      });

      $(document).ready(function () {
        //重複してしまうため色変更イベントを一時削除
        $('#color').off('click');
        $('#color').on('click', function (event) {
          event.preventDefault();
          console.log('colorクリック!');
          //タイトルが赤色だった場合
          if (listTitle.titleThis.style.color == 'red') {
            $.ajax({
              url: '/mypage/',
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                data: 'color',
                id: listTitle.id,
                color: 'black',
              }),
              success: function (res) {
                console.log(`success受信(color) : "${res.response}"`);
                listTitle.titleThis.style.color = res.response;
              },
            });
            //タイトルが黒の場合に実行
          } else {
            console.log('blackの場合');
            $.ajax({
              url: '/mypage/',
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                data: 'color',
                id: listTitle.id,
                color: 'red',
              }),
              success: function (res) {
                console.log(`success受信(color) : "${res.response}"`);
                listTitle.titleThis.style.color = res.response;
              },
            });
          }
        });
      });

      document.addEventListener(
        'mousedown',
        (e) => {
          let flg = false;
          // console.log(e.target);
          // console.log(listTitle.titleThis);
          if (e.target == listTitle.titleThis) flg = true;
          bodyClickJuge(listTitle.titleThis, null, flg, 'backgroundColor');
        },
        { once: true }
      );
    });
  }

  function folderContextmenu() {
    $('.folder').on('contextmenu', function () {
      console.log(
        `"${$(this).html()}" ${$(this).attr('value')} を右クリックしました`
      );
      let folderList = {
        folderTitle: $(this).html(),
        folderId: $(this).attr('value'),
        folderThis: this,
      };

      folderList.folderThis.style.backgroundColor = '#A7F1FF';
      folderList.folderThis.style.borderRadius = '10px';

      let elements = document.getElementsByClassName(
        `parent${folderList.folderThis.parentNode.parentNode.id}`
      );
      let index = [].slice
        .call(elements)
        .indexOf(folderList.folderThis.parentNode);
      index++;
      console.log(
        `id:${folderList.folderId},title:${folderList.folderTitle},order:${index},parent_id:${folderList.folderThis.parentNode.parentNode.id}`
      );
      //console.log(folderList.folderThis);
      document.getElementById('folderDelete').onclick = function () {
        let btn = confirm(
          `${folderList.folderTitle} 配下のフォルダやノートも全て削除されますが本当に削除しますか？`
        );

        //はいを押した場合(true)
        if (btn) {
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'folder',
              flg: 'folderDel',
              id: folderList.folderId,
              title: folderList.folderTitle,
              order: index,
              parentId: folderList.folderThis.parentNode.parentNode.id,
            }),
            success: function (res) {
              //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？
              $(`#folder${res.response}`).parent().remove();
              // console.log(res.response1);
              // console.log(res.response2);
              $.ajax({
                url: '/mypage/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'childFolder',
                  id: folderList.folderId,
                  file: res.response1,
                  folder: res.response2,
                }),
                success: function (res) {
                  console.log(res.response);
                  //削除されたファイルのタブを削除する
                  for (i = 0; i < res.response.length; i++) {
                    //idArrayが文字列で格納されているため、num→String変換
                    if (idArray.includes(String(res.response[i]))) {
                      closeTab(res.response[i], undefined, tabFocus, idArray);
                      //idArrayの中にあるlistTitle.idを削除
                      idArray = idArray.filter(
                        (n) => n !== String(res.response[i])
                      );
                      //console.log(idArray);
                    }
                  }
                },
              });
            },
          });
        }
      };
      $(document).ready(function () {
        $('#folderName').off('click');
        $('#folderName').on('click', function (event) {
          console.log('folderNameをクリックしました');
          //テキストの作成
          const inputTab = document.createElement('input');
          inputTab.setAttribute('type', 'text');
          inputTab.setAttribute('id', 'inputTab');
          inputTab.setAttribute('name', 'list_title');
          inputTab.setAttribute('maxlength', '20');
          inputTab.setAttribute('size', '20');
          inputTab.style.display = 'block';
          inputTab.setAttribute('value', folderList.folderTitle);

          folderList.folderThis.after(inputTab);
          folderList.folderThis.style.display = 'none';

          let len = inputTab.value.length;
          document.getElementById('inputTab').focus();
          document.getElementById('inputTab').setSelectionRange(len, len);

          //Enter押下で変更する
          inputTab.addEventListener('keypress', function (e) {
            //Enter判定
            if (e.keyCode === 13) {
              //何も入力されていない時や空白や改行のみの入力
              if (!inputTab.value || !inputTab.value.match(/\S/g)) {
                alert('タイトルを入力してください');
              } else {
                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'folder',
                    flg: 'changeName',
                    id: folderList.folderId,
                    title: inputTab.value,
                  }),
                  success: function (res) {
                    //console.log(`success受信(title) : "${res.response}"`);
                    folderList.folderThis.style.display = 'block';
                    folderList.folderThis.innerHTML = res.response;
                    inputTab.remove();
                  },
                });
              }
            }
          });
          tmp1 = inputTab;
          tmp2 = folderList.folderThis;
          document.addEventListener('mousedown', eventFunc);
        });
      });
      $(document).ready(function () {
        $('#createNote').off('click');
        $('#createNote').on('click', function (event) {
          event.stopPropagation();
          let fID = document.getElementById(`folder${folderList.folderId}`);
          //expandableの場合に配下の要素を開く
          if (fID.parentNode.classList.contains('expandable') == true) {
            fID.click();
          }
          fileFlg = true;
          newCreateFile1(folderList.folderId);
          conme.style.display = 'none';
          conme2.style.display = 'none';
          conme3.style.display = 'none';
        });
      });
      $(document).ready(function () {
        $('#createfolder').off('click');
        $('#createfolder').on('click', function (event) {
          //console.log('"フォルダを作成する"押下');
          event.stopPropagation();
          let fID = document.getElementById(`folder${folderList.folderId}`);
          //expandableの場合に配下の要素を開く
          if (fID.parentNode.classList.contains('expandable') == true) {
            fID.click();
          }
          folderFlg = true;
          newCreateFolder1(folderList.folderId);
          conme.style.display = 'none';
          conme2.style.display = 'none';
          conme3.style.display = 'none';
        });
      });

      document.addEventListener(
        'mousedown',
        (e) => {
          let flg = false;
          // console.log(e.target);
          // console.log(listTitle.titleThis);
          if (e.target == folderList.folderThis) flg = true;
          bodyClickJuge(folderList.folderThis, null, flg, 'backgroundColor');
        },
        { once: true }
      );
    });
  }

  const noTab = document.createElement('p');
  noTab.innerHTML = 'こちらにnoteが出力されます';
  noTab.setAttribute('id', 'notab');
  tab.appendChild(noTab);

  //ファイルクリック時にタブを表示
  function fileClick() {
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
        url: '/mypage/',
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
          let tabelements = document.getElementsByClassName('tab-content');
          let tabId = document.getElementById(`Tab-ID${ID}`);
          let index = [].slice.call(tabelements).indexOf(tabId);
          //orderを格納し、focus=1へ
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'tab',
              flg: 'clickTab',
              id: ID,
              order: index + 1,
              title: listTitle.title,
            }),
            success: function (res) {
              document.getElementById('notepass').innerHTML = pass;
            },
          });
        },
      });
    });
  }

  //ページを更新した際に前回のタブ情報を載せる
  function tabUpload() {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabDesc',
      }),
      success: function (res) {
        console.log(res.response);
        for (const hoge of Object.keys(res.response)) {
          const tab = res.response[hoge];
          titleClick(tab.id, tab.tabTitle);
        }
        if (res.response.length != 0) {
          setTimeout(() => {
            $.ajax({
              url: '/mypage/',
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

  //*********** タブ生成関数(更新時) ************
  function titleClick(Id, title) {
    //タブ生成しておらず、・・・じゃないとき
    if (idArray.includes(Id) == false) {
      $.ajax({
        url: '/mypage/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'note',
          flg: 'info',
          id: Id,
        }),
        success: function (res) {
          console.log(res.response);
          //input生成
          const inputTab = document.createElement('input');
          inputTab.setAttribute('id', 'TAB-ID' + Id);
          inputTab.setAttribute('type', 'radio');
          inputTab.setAttribute('name', 'TAB');
          inputTab.setAttribute('class', 'tab-switch');
          inputTab.setAttribute('checked', 'checked');
          //label生成
          const labelTab = document.createElement('label');
          labelTab.setAttribute('class', 'tab-label');
          labelTab.setAttribute('id', 'tab-ID' + Id);
          labelTab.setAttribute('for', 'TAB-ID' + Id);
          labelTab.style.display = 'block';

          const tabname = document.createElement('p');
          tabname.setAttribute('class', 'tabname');
          tabname.setAttribute('id', 'tabname' + Id);
          tabname.innerHTML = title;

          //[✖️]ボタン作成
          const buttonTab = document.createElement('button');
          buttonTab.setAttribute('class', 'buttonTab');
          buttonTab.setAttribute('id', 'button' + Id);
          buttonTab.innerHTML = '×';

          // div要素を生成
          let div = document.createElement('div');
          div.className = 'tab-content';
          div.setAttribute('id', 'Tab-ID' + Id);
          div.setAttribute('value', Id);
          let div1 = document.createElement('div');
          div1.setAttribute('class', 'title');
          let p = document.createElement('p');
          p.setAttribute('class', 'title-txt');
          p.style.fontSize = '25px';
          p.style.color = 'black';
          p.style.textAlign = 'left';
          p.setAttribute('id', 'tabP' + Id);
          let inputShare = document.createElement('input');
          inputShare.type = 'submit';
          inputShare.value = '共有する';
          let divFade = document.createElement('div');
          let div2 = document.createElement('div');
          div2.setAttribute('class', 'form-group');
          let textarea = document.createElement('textarea');
          textarea.readOnly = true;
          textarea.style.height = '500px';
          let inputEdit = document.createElement('input');
          inputEdit.type = 'submit';
          inputEdit.value = '編集する';
          p.innerHTML = res.response.title;
          textarea.innerHTML = res.response.memo_text;
          let fadeFont = document.createElement('p');
          fadeFont.setAttribute('class', 'fade-out-font');
          fadeFont.innerHTML = `保存が完了いたしました`;
          fadeFont.classList.add('fadeout');
          fadeFont.style.visibility = 'hidden';
          let time = document.createElement('p');
          time.setAttribute('class', 'updatetime');
          time.style.color = 'black';
          time.innerHTML = res.response.saved_time;

          //要素追加
          tab.appendChild(inputTab);
          tab.appendChild(labelTab);
          labelTab.appendChild(tabname);
          labelTab.appendChild(buttonTab);
          tab.appendChild(div);
          div.appendChild(div1);
          div.appendChild(divFade);
          div.appendChild(div2);
          div1.appendChild(p);
          div1.appendChild(inputShare);
          div2.appendChild(textarea);
          div.appendChild(inputEdit);
          divFade.appendChild(fadeFont);
          div.appendChild(time);

          document.getElementById('notab').style.display = 'none';

          idArray.push(Id);
          //「編集する」ボタンクリック
          inputEdit.onclick = function () {
            var p1 = document.createElement('p');
            p1.innerHTML =
              '※現在編集中です。編集完了後【保存する】ボタンを押してください';
            div.appendChild(p1);
            textarea.readOnly = false;
            let titletext = document.createElement('input');
            titletext.setAttribute(
              'value',
              document.getElementById(`tabP${Id}`).innerHTML
            );
            document.getElementById(`tabP${Id}`).after(titletext);
            document.getElementById(`tabP${Id}`).style.display = 'none';

            var inputKeep = document.createElement('input');
            var inputCancel = document.createElement('input');
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
                Id,
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
                Id,
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
            shareButton(Id);
          };

          //タブ上の「✖️」ボタン押下
          buttonTab.onclick = () => {
            closeButton(Id, title, tabFocus, idArray);
          };

          //タブをクリックした際の処理
          document.getElementById(`tab-ID${Id}`).onclick = (e) => {
            tabClick(e, Id, title, tabFocus);
          };
        },
      });

      //既にタブが生成されている場合
    } else {
      console.log(`既に[${idArray}]にあります`);
      //タブをクリックしたことにする
      $(`#tab-ID${Id}`).trigger('click');
    }
  }

  function jQUI() {
    let childnoteArray = [];
    $(function () {
      $('#0').treeview({
        animated: 'fast',
        collapsed: true,
        control: '.treecontrol',
      });
      $('#0').sortable({
        delay: 500,
        onDragStart: function (item) {
          console.log('***ドラッグスタート***');
          let elements = document.getElementsByClassName(
            `parent${item[0].parentNode.id}`
          );
          let str = item.prevObject[0].id;
          const regex = /[^0-9]/g;
          let id = str.replace(regex, '');
          //initial_index はD&D前の順番
          initial_index = [].slice.call(elements).indexOf(item[0]);
          initial_index++;
          parent_id_Tmp = item[0].parentNode.id;
          console.log(item);
          console.log(item.prevObject[0]);
          console.log(item.prevObject[0].id);
          let id_tmp = item.prevObject[0].id;
          let id_tmp2 = item.prevObject[0].id;
          console.log(id);
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
              console.log(`配下の全てのノートのidは↓`);
              childnoteArray = res.response;
              console.log(childnoteArray);
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
          let elements = document.getElementsByClassName(
            `parent${item[0].parentNode.id}`
          );

          //index: D&D後の配列の順番
          let index = [].slice.call(elements).indexOf(item[0]);
          index++;
          console.log(`rootから"${i / 2}"個下の階層です`);
          console.log(
            `移動後(folder)【order:${index}(違う階層の場合は0), parent_id: ${item[0].parentNode.id}】`
          );

          //リストの+−ボタンを押下してもドラッグできるようにした(次の兄弟のspan要素を代入している)
          if (item.prevObject[0].classList.contains('hitarea')) {
            item.prevObject[0] = item.prevObject[0].nextElementSibling;
          }

          //*****************************ファイル移動の場合**********************************
          if (item.prevObject[0].className.indexOf('file') != -1) {
            //移動後も同じparent_id
            if (parent_id_Tmp == item[0].parentNode.id) {
              //下へD＆D
              if (initial_index < index) {
                console.log('ファイル:下へD&D');
                let id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'note',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'down',
                    order: index,
                  }),
                  success: function (res) {
                    //console.log(`parent_id追加成功!! ${res.response}`);
                  },
                });
                //上へD＆D
              } else if (initial_index > index) {
                console.log('ファイル:上へD&D');
                let id = item[0].childNodes[0].getAttribute('value');

                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'note',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    move: 'up',
                    order: index,
                  }),
                  success: function (res) {
                    //console.log(`parent_id追加成功!! ${res.response}`);
                  },
                });
              } else {
                console.log('順番は変化していません');
              }
              //移動後は違うparent_id
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              console.log('ファイル:違うParentID');
              let id = item[0].childNodes[0].getAttribute('value');

              $.ajax({
                url: '/mypage/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'note',
                  flg: 'parentIDDiffer',
                  parent_id: item[0].parentNode.id,
                  old_parent_id: parent_id_Tmp,
                  id,
                  order: index,
                  old_order: initial_index,
                }),
                success: function (res) {
                  console.log(`追加成功 parent_id: ${res.response1}`);
                  item[0].classList.replace(
                    `parent${parent_id_Tmp}`,
                    `parent${item[0].parentNode.id}`
                  );
                  let elements = document.getElementsByClassName(
                    `parent${item[0].parentNode.id}`
                  );
                  //index: D&D後のparent_id内での順番
                  let index = [].slice.call(elements).indexOf(item[0]);
                  index++;
                  console.log(
                    `移動後(folder)【order:${index}(違う階層の場合は0), parent_id: ${item[0].parentNode.id}】`
                  );
                  //パス更新
                  let pass = passGet(id, item[0].childNodes[0].innerHTML);
                  //console.log(pass);
                  $.ajax({
                    url: '/mypage/',
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      data: 'addOrder',
                      id: id,
                      parent_id: item[0].parentNode.id,
                      order: index,
                      pass,
                      pattern: 'file',
                    }),
                    success: function (res) {
                      //console.log(res.response1);
                      //console.log(res.response2);
                      //passを正しく表示する2点セット
                      //1.focusが当たってたらパス更新
                      if (res.response2 !== undefined && res.response2 == 1) {
                        document.getElementById('notepass').innerHTML =
                          res.response1;
                      }
                    },
                  });
                },
              });
            } else {
              console.log('例外');
            }

            //*************************フォルダ移動の場合******************************
          } else {
            //移動後も同じparent_id
            if (parent_id_Tmp == item[0].parentNode.id) {
              //orderが大きくなる場合(下へD＆D);
              if (initial_index < index) {
                console.log('フォルダ:下へD&D');
                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'folder',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: index,
                    move: 'down',
                  }),
                  success: function (res) {
                    console.log(`追加成功 parent_id: ${res.response1}`);
                  },
                });
                //orderが小さくなる場合(上へD＆D)
              } else if (initial_index > index) {
                console.log('フォルダ:上へD&D');
                $.ajax({
                  url: '/mypage/',
                  type: 'POST',
                  dataType: 'Json',
                  contentType: 'application/json',
                  data: JSON.stringify({
                    data: 'folder',
                    flg: 'parentIDSame',
                    parent_id: item[0].parentNode.id,
                    id,
                    order: index,
                    move: 'up',
                  }),
                  success: function (res) {
                    console.log(`追加成功 parent_id: ${res.response1}`);
                  },
                });
              } else {
                console.log('順番は変化していません');
              }
              //移動後は違うparent_id
            } else if (parent_id_Tmp != item[0].parentNode.id) {
              console.log('フォルダ:違うParentID');
              //D&D後に新しく追加された側のorderの動き
              $.ajax({
                url: '/mypage/',
                type: 'POST',
                dataType: 'Json',
                contentType: 'application/json',
                data: JSON.stringify({
                  data: 'folder',
                  flg: 'parentIDDiffer',
                  parent_id: item[0].parentNode.id,
                  old_parent_id: parent_id_Tmp,
                  id,
                  //order: index,
                  old_order: initial_index, //元order
                }),
                success: function (res) {
                  console.log(`追加成功 parent_id: ${res.response}`);
                  item[0].classList.replace(
                    `parent${parent_id_Tmp}`,
                    `parent${item[0].parentNode.id}`
                  );
                  let elements = document.getElementsByClassName(
                    `parent${item[0].parentNode.id}`
                  );
                  //index: D&D後のparent_id内での順番
                  let index = [].slice.call(elements).indexOf(item[0]);
                  index++;
                  console.log(
                    `移動後(folder)【order:${index}(違う階層の場合は0), parent_id: ${item[0].parentNode.id}】`
                  );
                  console.log(list);
                  $.ajax({
                    url: '/mypage/',
                    type: 'POST',
                    dataType: 'Json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      data: 'addOrder',
                      id: id,
                      parent_id: item[0].parentNode.id,
                      order: index,
                      pattern: 'folder',
                    }),
                    success: function (res) {
                      //console.log(res.response);
                    },
                  });
                },
              });
            } else {
              console.log('例外');
            }
          }
        },
      });
    });
  }
  //フォルダー新規作成
  document.getElementById('newfolder').onclick = function (e) {
    e.stopPropagation();
    newCreateFolder1(0);
  };
  //ファイル新規作成
  document.getElementById('newfile').onclick = function () {
    e.stopPropagation();
    newCreateFile1(0);
  };

  //rootの１番配下に新しくフォルダを追加
  function newCreateFolder1(id) {
    console.log('フォルダー作成押下' + id);
    let li = document.createElement('li');
    li.setAttribute('class', 'closed');
    let span = document.createElement('span');
    span.setAttribute('class', 'folder');
    let ul = document.createElement('ul');
    //span.innerHTML = '新しいフォルダ';
    let inputTab = document.createElement('input');
    inputTab.setAttribute('type', 'text');
    inputTab.setAttribute('id', 'inputTab');
    inputTab.setAttribute('maxlength', '20');
    inputTab.setAttribute('size', '20');
    inputTab.style.display = 'block';
    inputTab.setAttribute('value', 'NewFolder');

    document.getElementById(id).appendChild(li);
    li.appendChild(span);
    span.appendChild(inputTab);
    //テキストエリアにフォーカスを当ててカーソルを末尾へ
    let len = inputTab.value.length;
    document.getElementById('inputTab').focus();
    document.getElementById('inputTab').setSelectionRange(len, len);

    //左クリック
    const clickL = function (e) {
      e.preventDefault();
      console.log('1' + folderFlg);
      if (folderFlg && !e.target.closest('#inputTab')) {
        console.log('左クリック');
        newCreateFolder2(inputTab, span, li, ul, id);
        folderFlg = false;
      }
      //addEnentLisnterが残る!?ので削除する。
      if (folderFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //右クリック
    const clickR = function (e) {
      e.preventDefault();
      console.log('2' + folderFlg);
      if (folderFlg && !e.target.closest('#inputTab')) {
        console.log('右クリック');
        newCreateFolder2(inputTab, span, li, ul, id);
        folderFlg = false;
      }
      if (folderFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //エンター押下時
    const enter = function (e) {
      //e.preventDefault(); //これがあると入力できない？？
      console.log('3');
      if (folderFlg) {
        if (e.keyCode === 13) {
          newCreateFolder2(inputTab, span, li, ul, id);
          folderFlg = false;
        }
      }
      if (folderFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //右・左・Enterそれぞれの実行
    document.addEventListener('click', clickL);
    document.addEventListener('contextmenu', clickR);
    inputTab.addEventListener('keypress', enter);
  }

  function newCreateFolder2(inputTab, span, li, ul, parentId) {
    //何も入力されていない時や空白や改行のみの入力
    if (!inputTab.value || !inputTab.value.match(/\S/g)) {
      alert('フォルダ名を入力してください');
    } else {
      console.log('入力されました');
      $.ajax({
        url: '/mypage/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'folder',
          flg: 'newFolder',
          pattern: 'new',
          folderName: inputTab.value,
          parentId,
        }),
        success: function (res) {
          console.log(`success受信(folderName) : "${res.response1}"`);
          span.setAttribute('id', `folder${res.response2.id}`);
          span.setAttribute('value', res.response2.id);
          inputTab.remove();
          span.innerHTML = res.response1;
          li.appendChild(ul);
          span.parentNode.setAttribute(
            'class',
            `parent${res.response2.parent_id}`
          );
          let elements = document.getElementsByClassName(
            `parent${res.response2.parent_id}`
          );
          //newIndex は並び替え(D&D) 後の配列の順番
          let newIndex = [].slice.call(elements).indexOf(span.parentNode);
          newIndex++;
          jQUI();
          folderContextmenu();
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'folder',
              flg: 'newFolder',
              pattern: 'order',
              folderName: inputTab.value,
              id: res.response2.id,
              order: newIndex,
            }),
            success: function (res) {
              //一度listを全て削除して、再び新しく追加している→jQueryUIがうまく適用されないため
              const node = document.getElementById('0');
              while (node.firstChild) {
                node.removeChild(node.firstChild);
              }
              listCreate();
            },
          });
        },
      });
    }
  }

  function newCreateFile1(id) {
    console.log('ファイル作成押下');
    let li = document.createElement('li');
    let span = document.createElement('span');
    li.setAttribute('class', 'last');
    span.classList.add('list_title', 'file');

    const inputTab = document.createElement('input');
    inputTab.setAttribute('type', 'text');
    inputTab.setAttribute('id', 'inputTab');
    inputTab.setAttribute('name', 'list_title');
    inputTab.setAttribute('maxlength', '20');
    inputTab.setAttribute('size', '20');
    inputTab.style.display = 'block';
    inputTab.setAttribute('value', 'NewNote');

    document.getElementById(id).appendChild(li);
    li.appendChild(span);
    span.appendChild(inputTab);

    //テキストエリアにフォーカスを当ててカーソルを末尾へ
    let len = inputTab.value.length;
    document.getElementById('inputTab').focus();
    document.getElementById('inputTab').setSelectionRange(len, len);

    //左クリック
    const clickL = function (e) {
      e.preventDefault();
      //console.log('1' + folderFlg);
      if (fileFlg && !e.target.closest('#inputTab')) {
        console.log('左クリック');
        newCreateFile2(inputTab, span, id);
        fileFlg = false;
      }
      //addEnentLisnterが残る!?ので削除する。
      if (fileFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //右クリック
    const clickR = function (e) {
      e.preventDefault();
      //console.log('2' + folderFlg);
      if (fileFlg && !e.target.closest('#inputTab')) {
        console.log('右クリック');
        newCreateFile2(inputTab, span, id);
        fileFlg = false;
      }
      if (fileFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //エンター押下時
    const enter = function (e) {
      //e.preventDefault(); //これがあると入力できない？？
      //console.log('3');
      if (fileFlg) {
        if (e.keyCode === 13) {
          newCreateFile2(inputTab, span, id);
          fileFlg = false;
        }
      }
      if (fileFlg == false) {
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
      }
    };
    //右・左・Enterそれぞれの実行
    document.addEventListener('click', clickL);
    document.addEventListener('contextmenu', clickR);
    inputTab.addEventListener('keypress', enter);
  }

  function newCreateFile2(inputTab, span, parentId) {
    //何も入力されていない時や空白や改行のみの入力
    if (!inputTab.value || !inputTab.value.match(/\S/g)) {
      alert('タイトルを入力してください');
    } else {
      //console.log('入力されました');
      $.ajax({
        url: '/mypage/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'note',
          flg: 'newNote',
          pattern: 'new',
          title: inputTab.value,
          parentId,
        }),
        success: function (res) {
          //console.log(`success受信(title) : "${res.response1}"`);
          span.setAttribute('id', `li${res.response2.id}`);
          span.setAttribute('value', res.response2.id);
          inputTab.remove();
          span.innerHTML = res.response1;
          span.parentNode.setAttribute(
            'class',
            `parent${res.response2.parent_id}`
          );
          let elements = document.getElementsByClassName(
            `parent${res.response2.parent_id}`
          );
          //newIndex は並び替え(D&D) 後の配列の順番
          let newIndex = [].slice.call(elements).indexOf(span.parentNode);
          console.log(newIndex);
          newIndex++;
          jQUI();
          fileContextmenu();
          fileClick();
          updateTime(res.response2.id);
          $.ajax({
            url: '/mypage/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'note',
              flg: 'newNote',
              pattern: 'order',
              folderName: inputTab.value,
              id: res.response2.id,
              order: newIndex,
            }),
            success: function (res) {
              //一度listを全て削除して、再び新しく追加している→jQueryUIがうまく適用されないため
              const node = document.getElementById('0');
              while (node.firstChild) {
                node.removeChild(node.firstChild);
              }
              listCreate();
            },
          });
        },
      });
    }
  }

  //「フォルダ追加」ボタン押下時(rootに参加)
  createbutton.addEventListener(
    'click',
    (e) => {
      if (!folderFlg) {
        let id = 0;
        e.stopPropagation();
        folderFlg = true;
        newCreateFolder1(id);
      }
    },
    false
  );
  //「ノート追加」ボタン押下時(rootに参加)
  createfilebutton.addEventListener(
    'click',
    (e) => {
      if (!fileFlg) {
        let id = 0;
        e.stopPropagation();
        fileFlg = true;
        newCreateFile1(id);
      }
    },
    false
  );
  //全削除ボタン押下
  $('.container-delete').click(function () {
    let btn = confirm(
      'ノートやフォルダが全て削除されますが本当に削除しますか？'
    );
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
  //全て折り畳む
  $('.collapsable').click(function () {
    //console.log('折り畳むぼたん押下');
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'folder',
        flg: 'collapsableALL',
      }),
      success: function (res) {
        console.log(res.response);
      },
    });
  });
  //全て展開
  $('.expandable').click(function () {
    //console.log('全て展開ぼたん押下');
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'folder',
        flg: 'expandableALL',
      }),
      success: function (res) {
        console.log(res.response);
      },
    });
  });

  //わからん。。。。nameクリック後の判定が、、、、なぜか上手くいく。。
  function eventFunc(e) {
    let flg = false;
    if (e.target == tmp1) flg = true;
    bodyClickJuge(tmp1, tmp2, flg, 'input');
  }

  //右・左クリック時にいろんなものを消したり戻したり。。。
  function bodyClickJuge(target1, target2, flg1, flg2) {
    if (flg1) {
      //console.log('同じ要素です');
    } else {
      //console.log('違う要素です');
      if (flg2 == 'backgroundColor') {
        target1.style.backgroundColor = 'white';
      } else if (flg2 == 'input') {
        target1.remove();
        target2.style.display = 'block';
      }
    }
  }

  $('.hamburger').click(function () {
    console.log('ハンバーガー押下');
  });

  document.getElementById('logout').addEventListener('click', () => {
    //Cookieの削除をするためのPOST
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'cookiedelete',
      }),
      success: function (res) {},
    });
  });
});
