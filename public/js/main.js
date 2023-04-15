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

import { orderGet } from './stringUtils.js';

let tmp1;
let tmp2;
let tab = document.getElementById('tab');
let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');
var tabArray = []; //tab生成時にidを配列へ格納
let tabFocus;
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
        console.log(res);
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
        jQueryUIOptionsFunc(); //jQueryUIを付与
        fileContextmenu(tabArray, tabFocus); //ファイルの右クリックメニュー
        folderContextmenu(tabArray, tabFocus, fileFlg, folderFlg); //フォルダーの右クリックメニュー
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
          let index = orderGet('tab-content', `Tab-ID${ID}`);
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
      success: async function (res) {
        for (const tab of res.response) {
          await titleClick(tab.id, tab.tabTitle);
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

  //*********** タブ生成関数(ページリロード時) ************
  async function titleClick(id, title) {
    return new Promise((resolve) => {
      //タブ生成しておらず、・・・じゃないとき
      if (tabArray.includes(id) == false) {
        $.ajax({
          url: '/mypage/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'note',
            flg: 'info',
            id,
          }),
          success: function (res) {
            //resolve()を呼び出すことで、Promiseオブジェクトが完了したことを示すことができる
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
              closeButton(id, title, tabFocus, tabArray);
              tabArray = deleteTabArray(id, tabArray);
            };

            //タブをクリックした際の処理
            document.getElementById(`tab-ID${id}`).onclick = (e) => {
              tabClick(e, id, title, tabFocus);
            };
          },
        });

        //既にタブが生成されている場合
      } else {
        //console.log(`既に[${tabArray}]にあります`);
        //タブをクリックしたことにする
        $(`#tab-ID${id}`).trigger('click');
      }
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
    newFileCreate(0);
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
          jQueryUIOptionsFunc();
          folderContextmenu(tabArray, tabFocus, fileFlg, folderFlg);
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

  function newFileCreate(id) {
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
    //テキストエリアにフォーカスを当ててカーソルを末尾へ;
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
          jQueryUIOptionsFunc();
          fileContextmenu(tabArray, tabFocus);
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
        newFileCreate(id);
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
      success: function (res) {},
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
      success: function (res) {},
    });
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
        console.log(error);
        // エラー処理を行うコード
      });
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
