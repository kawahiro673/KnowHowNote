import { closeTab, deleteTabArray } from './tab_func.js';

import { newFileCreateFunc } from './newFileCreate.js';
import { newFolderCreateFunc } from './newFolderCreate.js';

//import { newCreateFile } from './main.js';

let tmp1;
let tmp2;

let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');

export const folderContextmenu = (
  tabIdArray,
  fileInputExistFlg,
  folderInputExistFlgFlg
) => {
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

    document.getElementById('folderDelete').onclick = function () {
      folderDelete(folderList, index, tabIdArray);
    };

    $(document).ready(function () {
      $('#folderName').off('click');
      $('#folderName').on('click', function (event) {
        folderNameChange(folderList);
      });
    });

    $(document).ready(() => {
      $('#createNote').off('click');
      $('#createNote').on('click', (e) => {
        e.stopPropagation();
        let fID = document.getElementById(`folder${folderList.folderId}`);
        //expandableの場合に配下の要素を開く
        if (fID.parentNode.classList.contains('expandable') === true) {
          fID.click();
        }
        fileInputExistFlg = true;
        // await
        const createfilebutton = document.getElementById('createfilebutton');

        createfilebutton.onclick = function (event) {
          event.preventDefault();
          console.log('リンクがクリックされましたが、動作を無効にしました。');
        };

        newFileCreateFunc(folderList.folderId, fileInputExistFlg, tabIdArray);

        conme.style.display = 'none';
        conme2.style.display = 'none';
        conme3.style.display = 'none';
        conme4.style.display = 'none';
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
        folderInputExistFlgFlg = true;
        newFolderCreateFunc(
          folderList.folderId,
          folderInputExistFlgFlg,
          fileInputExistFlg,
          tabIdArray
        );
        conme.style.display = 'none';
        conme2.style.display = 'none';
        conme3.style.display = 'none';
        conme4.style.display = 'none';
      });
    });

    document.addEventListener(
      'mousedown',
      (e) => {
        let flg = false;
        if (e.target == folderList.folderThis) flg = true;
        bodyClickJuge(folderList.folderThis, null, flg, 'backgroundColor');
      },
      { once: true }
    );
  });
};

const folderDelete = (folderList, index, tabIdArray) => {
  let btn = confirm(
    `${folderList.folderTitle} 配下のフォルダやノートも全て削除されますが本当に削除しますか？`
  );
  //はいを押した場合(true)
  if (btn) {
    $.ajax({
      url: '/folderPostController/',
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
            for (let i = 0; i < res.response.length; i++) {
              //idArrayが文字列で格納されているため、num→String変換
              if (tabIdArray.includes(String(res.response[i]))) {
                closeTab(res.response[i], undefined, tabIdArray);
                //idArrayの中にあるlistTitle.idを削除
                tabIdArray = deleteTabArray(
                  String(res.response[i]),
                  tabIdArray
                );
              }
            }
          },
        });
      },
    });
  }
};

const folderNameChange = (folderList) => {
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
          url: '/folderPostController/',
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
};

//わからん。。。。nameクリック後の判定が、、、、なぜか上手くいく。。
function eventFunc(e) {
  let flg = false;
  if (e.target == tmp1) flg = true;
  bodyClickJuge(tmp1, tmp2, flg, 'input');
}

//右・左クリック時にいろんなものを消したり戻したり。。。
const bodyClickJuge = (target1, target2, flg1, flg2) => {
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
};
