let right = document.getElementById('right');
let rightClicks = document.getElementsByClassName('rightclick'); //右クッリクエリア（ここではcontainer0）
let listTitles = document.getElementsByClassName('list_title');
let tab = document.getElementById('tab');
let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let idGet = document.getElementsByClassName('idGet');
let hitarea = document.getElementsByClassName('hitarea');
let tmpForm;
let borderTmp; //枠のついたlistTitles一時保持
let borderArray;
var idArray = []; //tab生成時にidを配列へ格納
let tabFocus;
let initial_index;
let parent_id_Tmp;
let list;
let tmpArray = [];
let fileFlg = false;
let folderFlg = false;

let tmp1;
let tmp2;
let tmp3;
let tmp4;

window.onload = function () {
  //listの作成
  function listCreate() {
    $.ajax({
      url: '/index/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'list',
      }),
      success: function (res) {
        // console.log(res.response); //folder取得
        // console.log(res.response2); //file取得
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
              res.response.forEach((folder) => {
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
              });
              //file追加
              resTmp2.forEach((file) => {
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
                  //console.log(`${file.title}の要素を作成しました`);
                  crFlg = true;
                }
              });
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
          for (i = 0; i < fol.length; i++) {
            fol[i].addEventListener('click', function () {
              let closedFlg = 0;
              console.log(this.id.replace(/[^0-9]/g, ''));
              //folderが閉じているとflg=1
              if (this.parentNode.classList.contains('expandable')) {
                closedFlg = 1;
              }

              $.ajax({
                url: '/index/',
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

  listCreate();
  tabUpload();

  $('#right').on('click contextmenu', function (e) {
    //list_title上で右クッリク
    if (e.target.closest('.list_title')) {
      conme.style.left = e.pageX + 'px';
      conme.style.top = e.pageY + 'px';
      conme.style.display = 'block';
      conme2.style.display = 'none';
      conme3.style.display = 'none';
    } else if (e.target.closest('.folder')) {
      conme3.style.left = e.pageX + 'px';
      conme3.style.top = e.pageY + 'px';
      conme3.style.display = 'block';
      conme.style.display = 'none';
      conme2.style.display = 'none';
    } else {
      conme.style.display = 'none';
      conme2.style.left = e.pageX + 'px';
      conme2.style.top = e.pageY + 'px';
      conme2.style.display = 'block';
    }
    document.body.addEventListener('click', function (e) {
      conme.style.display = 'none';
      conme2.style.display = 'none';
      conme3.style.display = 'none';
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
    }
  });

  function fileContextmenu() {
    $('.list_title').on('contextmenu', function () {
      // console.log(
      //   `"${$(this).html()}" ${$(this).attr('value')} を右クリックしました`
      // );
      let listTitle = {
        title: $(this).html(),
        id: $(this).attr('value'),
        titleThis: this,
      };

      listTitle.titleThis.style.backgroundColor = '#A7F1FF';
      listTitle.titleThis.style.borderRadius = '10px';
      borderTmp = listTitle.titleThis;

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
            url: '/index/',
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
                closeTab(listTitle.id, tabIndex);
                //idArrayの中にあるlistTitle.idを削除
                idArray = idArray.filter((n) => n !== listTitle.id);
              }

              $.ajax({
                url: '/index/',
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
          inputTab.setAttribute('maxlength', '10');
          inputTab.setAttribute('size', '20');
          inputTab.style.display = 'block';
          inputTab.setAttribute('value', listTitle.title);

          listTitle.titleThis.after(inputTab);
          listTitle.titleThis.style.display = 'none';
          //tmpForm = inputTab;
          //Enter押下で変更する
          inputTab.addEventListener('keypress', function (e) {
            //Enter判定
            if (e.keyCode === 13) {
              //何も入力されていない時や空白や改行のみの入力
              if (!inputTab.value || !inputTab.value.match(/\S/g)) {
                alert('タイトルを入力してください');
              } else {
                console.log(inputTab.value, listTitle.title);
                $.ajax({
                  url: '/index/',
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
                    console.log(`success受信(title) : "${res.response1}"`);
                    //tmpForm.remove();
                    listTitle.titleThis.style.display = 'block';
                    listTitle.titleThis.innerHTML = res.response1;
                    inputTab.remove();
                    //タブが生成済みの場合
                    if (res.response2 != undefined) {
                      //リアルタイムにタイトル更新
                      document.getElementById(
                        `tab-ID${listTitle.id}`
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
              url: '/index/',
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
              url: '/index/',
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
            url: '/index/',
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
                url: '/index/',
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
                      closeTab(res.response[i]);
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
          inputTab.setAttribute('maxlength', '10');
          inputTab.setAttribute('size', '20');
          inputTab.style.display = 'block';
          inputTab.setAttribute('value', folderList.folderTitle);

          folderList.folderThis.after(inputTab);
          folderList.folderThis.style.display = 'none';
          //tmpForm = inputTab;
          //Enter押下で変更する
          inputTab.addEventListener('keypress', function (e) {
            //Enter判定
            if (e.keyCode === 13) {
              //何も入力されていない時や空白や改行のみの入力
              if (!inputTab.value || !inputTab.value.match(/\S/g)) {
                alert('タイトルを入力してください');
              } else {
                $.ajax({
                  url: '/index/',
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
                    console.log(`success受信(title) : "${res.response}"`);
                    //tmpForm.remove();
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
        });
      });
      $(document).ready(function () {
        $('#createfolder').off('click');
        $('#createfolder').on('click', function (event) {
          console.log('"フォルダを作成する"押下');
          event.stopPropagation();
          let fID = document.getElementById(`folder${folderList.folderId}`);
          //expandableの場合に配下の要素を開く
          if (fID.parentNode.classList.contains('expandable') == true) {
            fID.click();
          }
          folderFlg = true;
          console.log(`追加するファイルの親IDは${folderList.folderId}`);
          newCreateFolder1(folderList.folderId);
          console.log('無事に追加されました');
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
      console.log(`"${listTitle.title}"がクリックされました。`);
      let ID = Number(listTitle.id);
      titleClick(ID, listTitle.title);

      $.ajax({
        url: '/index/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'tab',
          flg: 'tabAdd',
          id: ID,
          title: listTitle.title,
        }),
        success: function (res) {
          let tabelements = document.getElementsByClassName('tab-content');
          let tabId = document.getElementById(`Tab-ID${ID}`);
          let index = [].slice.call(tabelements).indexOf(tabId);
          //orderを格納し、focus=1へ
          $.ajax({
            url: '/index/',
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
              //console.log(res.response);
            },
          });
        },
      });
    });
  }

  //ページを更新した際に前回のタブ情報を載せる
  function tabUpload() {
    $.ajax({
      url: '/index/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabDesc',
      }),
      success: function (res) {
        console.log(res.response);
        for (const tab of res.response) {
          titleClick(tab.id, tab.tabTitle);
        }
        if (res.response.length != 0) {
          setTimeout(() => {
            $.ajax({
              url: '/index/',
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                data: 'tab',
                flg: 'focusTab',
              }),
              success: function (res) {
                //console.log(res.response.id);
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
    //console.log(Id, title);
    //タブ生成しておらず、・・・じゃないとき
    if (idArray.includes(Id) == false) {
      // $.ajax({
      //   url: '/index/',
      //   type: 'POST',
      //   dataType: 'Json',
      //   contentType: 'application/json',
      //   data: JSON.stringify({
      //     data: 'note',
      //     flg: 'info',
      //     id: Id,
      //   }),
      //   success: function (res) {
      //     console.log(res.response);
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
      labelTab.innerHTML = title;
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
      let shareBtn = document.createElement('button');
      shareBtn.setAttribute('class', 'sharebtn');
      shareBtn.innerHTML = '共有する';
      let divFade = document.createElement('div');
      let div2 = document.createElement('div');
      div2.setAttribute('class', 'form-group');
      let textarea = document.createElement('textarea');
      textarea.readOnly = true;
      textarea.style.height = '500px';
      let inputEdit = document.createElement('input');
      inputEdit.type = 'submit';
      inputEdit.value = '編集する';
      p.innerHTML = 'res.response.title';
      textarea.innerHTML = 'res.response.memo_text';
      let fadeFont = document.createElement('p');
      fadeFont.setAttribute('class', 'fade-out-font');
      fadeFont.innerHTML = `保存が完了いたしました`;
      fadeFont.classList.add('fadeout');
      fadeFont.style.visibility = 'hidden';
      let time = document.createElement('p');
      time.setAttribute('class', 'updatetime');
      time.style.color = 'black';
      time.innerHTML = 'res.response.saved_time;';

      //要素追加
      tab.appendChild(inputTab);
      tab.appendChild(labelTab);
      labelTab.appendChild(buttonTab);
      tab.appendChild(div);
      div.appendChild(div1);
      div.appendChild(divFade);
      div.appendChild(div2);
      div1.appendChild(p);
      div1.appendChild(shareBtn);
      div2.appendChild(textarea);
      div.appendChild(inputEdit);
      divFade.appendChild(fadeFont);
      div.appendChild(time);

      console.log(`"id: ${Id} title: ${title}"のタブが生成されました`);

      document.getElementById('notab').style.display = 'none';

      idArray.push(Id);

      inputEdit.onclick = function () {
        var p1 = document.createElement('p');
        p1.innerHTML =
          '※現在編集中です。編集完了後【保存する】ボタンを押してください';
        div.appendChild(p1);
        textarea.readOnly = false;
        let titletext = document.createElement('input');
        titletext.setAttribute('value', title);
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
        inputKeep.onclick = function () {
          keepButton(
            Id,
            p,
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
        inputCancel.onclick = function () {
          cancelButton(Id, p1, inputKeep, inputCancel, inputEdit, textarea);
        };
      };

      //タブ上の「✖️」ボタン押下
      buttonTab.onclick = function () {
        console.log(`id:${Id}, title:"${title}"タブを閉じました`);
        let tabelements = document.getElementsByClassName('tab-content');
        let tabId = document.getElementById(`Tab-ID${Id}`);
        let index = [].slice.call(tabelements).indexOf(tabId);
        index = index + 1;
        closeTab(Id, index);
        $.ajax({
          url: '/index/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'tab',
            flg: 'info',
            id: Id,
            title,
          }),
          success: function (res) {
            if (res.response.length == 0) {
              document.getElementById('notepass').innerHTML = '';
            }
          },
        });
      };

      document.getElementById(`tab-ID${Id}`).onclick = function (e) {
        //閉じるボタン以外押下時
        if (!e.target.closest('.buttonTab')) {
          var a = $(event.target).closest(`#button${Id}`).length;
          if (a) {
            //nameをクリック
          } else {
            tabFocus = Id;
          }
          //パスを取得する関数
          let pass = passGet(Id, title);
          console.log(pass);
          //クリックしたTabのfocusを1へ、その他を0へ
          $.ajax({
            url: '/index/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              data: 'tab',
              flg: 'updateFocus',
              id: Id,
              title,
              pass,
            }),
            success: function (res) {
              //console.log('タブクリックしたぞ(ajax)');
              document.getElementById('notepass').innerHTML = pass;
            },
          });
        } else {
          //タブ閉じるボタン押下
        }
      };
      //   },
      // });

      //既にタブが生成されている場合
    } else {
      console.log(`既に[${idArray}]にあります`);
      //タブをクリックしたことにする
      $(`#tab-ID${Id}`).trigger('click');
    }
  }

  function keepButton(
    id,
    p,
    textarea,
    p1,
    fadeFont,
    inputKeep,
    inputCancel,
    inputEdit,
    time,
    newTitle,
    titletext
  ) {
    $.ajax({
      url: '/index/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'note',
        flg: 'noteKeep',
        id: id,
        titleContent: newTitle, //p.innerHTML,
        memoContent: textarea.value, //ここに入力した値が入る
      }),
      success: function (res) {
        //console.log(res.response2);
        fadeFont.style.visibility = 'visible';
        //1000ミリ秒後に表示を隠す
        setTimeout(function () {
          fadeFont.style.visibility = 'hidden';
          // updateTime.innerHTML = res.response2.saved_time;
        }, 1000);
      },
    });
    p1.remove();
    inputKeep.remove();
    inputCancel.remove();
    document.getElementById(`tabP${id}`).innerHTML = newTitle;
    document.getElementById(`tabP${id}`).style.display = 'block';
    document.getElementById(`tab-ID${id}`).innerHTML = newTitle;
    document.getElementById(`li${id}`).innerHTML = newTitle;
    titletext.remove();
    inputEdit.style.display = 'block';
    textarea.readOnly = true;
    updateTime(id, time);
  }

  function cancelButton(
    id,
    p1,
    inputKeep,
    inputCancel,
    inputEdit,
    textarea,
    titletext
  ) {
    console.log('取り消すクリック');
    let btn = confirm(
      '本当に編集を取り消しますか？\n保存していないものは取り消されます。'
    );
    if (btn) {
      $.ajax({
        url: '/index/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'note',
          flg: 'info',
          id: id,
        }),
        success: function (res) {
          console.log(`取り消し成功！ ${res.response.memo_text}`);
          textarea.value = res.response.memo_text;
          document.getElementById(`tabP${id}`).innerHTML = res.response.title;
        },
      });
      document.getElementById(`tabP${id}`).style.display = 'block';
      p1.remove();
      inputKeep.remove();
      inputCancel.remove();
      titletext.remove();
      inputEdit.style.display = 'block';
      textarea.readOnly = true;
    }
  }

  function closeTab(id, index) {
    document.getElementById('TAB-ID' + id).remove();
    document.getElementById('tab-ID' + id).remove();
    document.getElementById('Tab-ID' + id).remove();

    $.ajax({
      url: '/index/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabDel',
        id,
        order: index,
      }),
      success: function (res) {
        //成功！！
      },
    });
    if (tabFocus == undefined) {
      tabFocus = id;
    }
    //フォーカスがあっているタブを削除する際に他のたぶへフォーカスを変更
    var result = idArray.indexOf(id);
    if (id == tabFocus) {
      console.log('アクティブなタグ削除！！');
      //idArrayの０番目じゃない場合。上に他のタブがまだある場合
      if (result != 0) {
        $(`#tab-ID${idArray[result - 1]}`).trigger('click');
        //idArrayの０番目の場合。タブの一番上の場合
      } else {
        $(`#tab-ID${idArray[result + 1]}`).trigger('click');
      }
    }

    //タブ削除したタイトルのIDをidArrayから削除
    idArray = idArray.filter((n) => n !== id);
    //タブ全削除判定
    if (idArray.length == 0) {
      document.getElementById('notab').style.display = 'block';
    }
    console.log(idArray);
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
          //console.log(item.prevObject[0].id);
          id_tmp = item.prevObject[0].id;
          id_tmp2 = item.prevObject[0].id;
          console.log(id);
          $.ajax({
            url: '/index/',
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
            url: '/index/',
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
                  url: '/index/',
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
                  url: '/index/',
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
                url: '/index/',
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
                    url: '/index/',
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
                      // console.log(res.response);
                      //passを正しく表示する2点セット
                      //1.focusが当たってたらパス更新
                      if (res.response2 == 1) {
                        document.getElementById('notepass').innerHTML =
                          res.response1;
                      }
                      //2.タブクリック時にパス更新
                      document.getElementById(`tab-ID${id}`).onclick =
                        function (e) {
                          document.getElementById('notepass').innerHTML =
                            res.response1;
                        };
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
                  url: '/index/',
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
                  url: '/index/',
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
                url: '/index/',
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
                    url: '/index/',
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
                      console.log(res.response);
                      // childnoteArray.forEach((note) => {
                      //   if (note == note.id) {
                      //     document.getElementById(`tab-ID${note.id}`).onclick =
                      //       function (e) {
                      //         document.getElementById('notepass').innerHTML =
                      //           res.response2;
                      //       };
                      //   }
                      // });
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
    inputTab.setAttribute('maxlength', '10');
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
        url: '/index/',
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
            url: '/index/',
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
    inputTab.setAttribute('maxlength', '10');
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
      console.log('1' + folderFlg);
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
      console.log('2' + folderFlg);
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
      console.log('3');
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
      console.log('入力されました');
      $.ajax({
        url: '/index/',
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
          console.log(`success受信(title) : "${res.response1}"`);
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
            url: '/index/',
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
        url: '/index/',
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
      url: '/index/',
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
      url: '/index/',
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

  //現在日時取得＆DB格納
  function updateTime(id, time) {
    let now = new Date();
    let Year = now.getFullYear();
    let Month = now.getMonth() + 1;
    let DATE = now.getDate();
    let Hour = now.getHours();
    let Min = now.getMinutes();
    //let Sec = now.getSeconds();
    $.ajax({
      url: '/index/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'note',
        flg: 'updatetime',
        id,
        time: `${Year}年${Month}月${DATE}日 ${Hour}:${Min}`,
      }),
      success: function (res) {
        //timeが空だと実行しない(ファイル作成時でtabを生成していないとき)
        if (time) time.innerHTML = res.response;
      },
    });
  }

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

  //passを取得する関数
  function passGet(id, title) {
    let pass = document.getElementById(`li${id}`);
    let parentArray = [];
    let answer = '';
    let i = 0;

    while (pass.parentNode.parentNode.id != '0') {
      parentArray.push(
        pass.parentNode.parentNode.previousElementSibling.innerHTML
      );
      pass = pass.parentNode.parentNode.previousElementSibling;
    }
    parentArray.forEach((p) => {
      i++;
      if (i == parentArray.length) {
        answer = `  ${p}` + answer;
      } else {
        answer = ` > ${p}` + answer;
      }
    });
    return answer + ' > ' + title;
  }
};
