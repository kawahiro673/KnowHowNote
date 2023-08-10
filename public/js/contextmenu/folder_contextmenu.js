import { closeTab } from '../tab_func.js';
import { newFileCreateFunc } from '../newFileCreate.js';
import { newFolderCreateFunc } from '../newFolderCreate.js';
import {
  orderGet,
  fileIDUnderTheFolder,
  resultPopUp,
  answerPopUp,
} from '../stringUtils.js';
import { tabFocusIDGet, hashedIdGet, getTabIdArray } from '../main.js';
import { disableElements, enableElements } from '../utilityFunction.js';

let tmp1;
let tmp2;

let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');

export const folderContextmenu = (tabIdArray) => {
  $('.folder').on('contextmenu', function () {
    let folder = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };

    folder.elem.style.backgroundColor = '#F5F5F5';
    folder.elem.style.borderRadius = '5px';

    const order = orderGet(
      `parent${folder.elem.parentNode.parentNode.id}`,
      folder.elem.parentNode.id
    );

    document.getElementById('folderDelete').onclick = async () => {
      // document.getElementById('popup-overlay_folder-delete').style.display =
      //   'block';
      // document.getElementById('folder-delete-name').innerHTML = folder.title;
      // const folderDeleteButtonListener = () => {
      //   folderDelete(folder, order, tabIdArray);
      //   document.getElementById('popup-overlay_folder-delete').style.display =
      //     'none';

      //   document
      //     .getElementById('yes-button-folder-delete')
      //     .removeEventListener('click', folderDeleteButtonListener);
      // };
      // document
      //   .getElementById('yes-button-folder-delete')
      //   .addEventListener('click', folderDeleteButtonListener);

      const result = await answerPopUp(
        'フォルダ削除',
        `"${folder.title}"の配下のフォルダやノートも全て削除されますが本当に削除しますか？`
      );
      if (result === true) {
        $.ajax({
          url: '/folderPostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            flg: 'folderDel',
            id: folder.id,
            title: folder.title,
            order,
            parentId: folder.elem.parentNode.parentNode.id,
          }),
          success: function (res) {
            //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？

            $(`#folder${folder.id}`).parent().remove();

            $.ajax({
              url: '/mypage/' + hashedIdGet,
              type: 'POST',
              dataType: 'Json',
              contentType: 'application/json',
              data: JSON.stringify({
                flg: 'childFolder',
                id: folder.id,
                file: res.fileResults,
                folder: res.folderResults,
              }),
              success: function (res) {
                console.log(res.response);
                console.log(tabIdArray);
                //削除されたファイルのタブを削除する
                for (let i = 0; i < res.response.length; i++) {
                  //idArrayが文字列で格納されているため、num→String変換
                  if (tabIdArray.includes(res.response[i])) {
                    closeTab(res.response[i], undefined, tabIdArray);
                    //idArrayの中にあるlistTitle.idを削除
                    tabIdArray = getTabIdArray();
                    console.log(tabIdArray);
                  }
                }
                resultPopUp('フォルダ削除', '削除しました');
              },
            });
          },
        });
      } else {
        // 「いいえ」が押された場合の処理 おそらくポップが閉じる
      }
    };

    $(document).ready(function () {
      $('#folderName').off('click');
      $('#folderName').on('click', function (e) {
        folderNameChange(folder);
      });
    });

    $(document).ready(() => {
      $('#createNote').off('click');
      $('#createNote').on('click', async (e) => {
        disableElements();
        e.stopPropagation();
        let fID = document.getElementById(`folder${folder.id}`);
        //expandableの場合に配下の要素を開く
        if (fID.parentNode.classList.contains('expandable') === true) {
          fID.click();
        }

        conme.style.display = 'none';
        conme2.style.display = 'none';
        conme3.style.display = 'none';
        conme4.style.display = 'none';
        await newFileCreateFunc(folder.id);
        setTimeout(() => {
          enableElements();
        }, 1500);
      });
    });

    $(document).ready(function () {
      $('#createfolder').off('click');
      $('#createfolder').on('click', async (event) => {
        disableElements();
        event.stopPropagation();
        let fID = document.getElementById(`folder${folder.id}`);
        //expandableの場合に配下の要素を開く
        if (fID.parentNode.classList.contains('expandable') == true) {
          fID.click();
        }
        conme.style.display = 'none';
        conme2.style.display = 'none';
        conme3.style.display = 'none';
        conme4.style.display = 'none';

        await newFolderCreateFunc(folder.id);
        setTimeout(() => {
          enableElements();
        }, 1500);
      });
    });

    document.addEventListener(
      'mousedown',
      (e) => {
        let flg = false;
        if (e.target == folder.elem) flg = true;
        bodyClickJuge(folder.elem, null, flg, 'backgroundColor');
      },
      { once: true }
    );
  });
};

// document
//   .getElementById('pop-delete_folder-delete')
//   .addEventListener('click', (e) => {
//     e.preventDefault(); // リンクのデフォルトの動作を無効化
//     document.getElementById('popup-overlay_folder-delete').style.display =
//       'none';
//   });

// document
//   .getElementById('no-button-folder-delete')
//   .addEventListener('click', (e) => {
//     e.preventDefault(); // リンクのデフォルトの動作を無効化
//     document.getElementById('popup-overlay_folder-delete').style.display =
//       'none';
//   });

// const folderDelete = (folder, order, tabIdArray) => {
//   $.ajax({
//     url: '/folderPostController/',
//     type: 'POST',
//     dataType: 'Json',
//     contentType: 'application/json',
//     data: JSON.stringify({
//       flg: 'folderDel',
//       id: folder.id,
//       title: folder.title,
//       order,
//       parentId: folder.elem.parentNode.parentNode.id,
//     }),
//     success: function (res) {
//       //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？

//       $(`#folder${folder.id}`).parent().remove();

//       $.ajax({
//         url: '/mypage/' + hashedIdGet,
//         type: 'POST',
//         dataType: 'Json',
//         contentType: 'application/json',
//         data: JSON.stringify({
//           flg: 'childFolder',
//           id: folder.id,
//           file: res.fileResults,
//           folder: res.folderResults,
//         }),
//         success: function (res) {
//           console.log(res.response);
//           console.log(tabIdArray);
//           //削除されたファイルのタブを削除する
//           for (let i = 0; i < res.response.length; i++) {
//             //idArrayが文字列で格納されているため、num→String変換
//             if (tabIdArray.includes(res.response[i])) {
//               closeTab(res.response[i], undefined, tabIdArray);
//               //idArrayの中にあるlistTitle.idを削除
//               tabIdArray = getTabIdArray();
//               console.log(tabIdArray);
//             }
//           }
//           resultPopUp('フォルダ削除', '削除しました');
//         },
//       });
//     },
//   });
// };

const folderNameChange = (folder) => {
  const inputTab = document.createElement('input');
  inputTab.setAttribute('type', 'text');
  inputTab.setAttribute('id', 'inputTab');
  inputTab.setAttribute('name', 'list_title');
  inputTab.setAttribute('maxlength', '20');
  inputTab.setAttribute('size', '20');
  inputTab.style.display = 'block';
  inputTab.setAttribute('value', folder.title);

  folder.elem.after(inputTab);
  folder.elem.style.display = 'none';

  //inputにフォーカスを当てて全選択
  document
    .getElementById('inputTab')
    .addEventListener('focus', (event) => event.target.select());
  document.getElementById('inputTab').focus();

  //Enter押下で変更する
  inputTab.addEventListener('keypress', function (e) {
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
            flg: 'changeName',
            id: folder.id,
            title: inputTab.value,
          }),
          success: function (res) {
            folder.elem.style.display = 'block';
            folder.elem.innerHTML = inputTab.value;
            inputTab.remove();

            //フォルダの名前変更時に、タブのフォーカスが当たっているファイルが配下にあればパスを変更する(対象のタブをクリックする)
            const fileUnder = fileIDUnderTheFolder(folder.elem.parentNode);
            const tabFocusID = tabFocusIDGet();
            if (fileUnder.includes(tabFocusID)) {
              $(`#tab-ID${tabFocusID}`).trigger('click');
            }
          },
        });
      }
    }
  });
  tmp1 = inputTab;
  tmp2 = folder.elem;
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
  } else {
    if (flg2 == 'backgroundColor') {
      target1.style.backgroundColor = 'white';
    } else if (flg2 == 'input') {
      target1.remove();
      target2.style.display = 'block';
    }
  }
};

//rootの右クリックから「フォルダ新規作成」押下
document.getElementById('newfolder').onclick = async (e) => {
  const id = 0;
  e.stopPropagation();
  await newFolderCreateFunc(id);
};
