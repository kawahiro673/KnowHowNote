import { closeTab } from '../tab_func.js';
import { newFileCreateFunc } from '../newFileCreate.js';
import { newFolderCreateFunc } from '../newFolderCreate.js';
import {
  orderGet,
  fileIDUnderTheFolder,
  resultPopUp,
  answerPopUp,
  explanationPopUp,
  focusAndAllSelections,
} from '../stringUtils.js';
import { tabFocusIDGet, getTabIdArray } from '../main.js';
import { disableElements, enableElements } from '../utilityFunction.js';
import { addLastClassToLastSibling } from '../treeviewLineUpdate.js';

let conme = document.getElementById('contextmenu');
let conme2 = document.getElementById('contextmenu2');
let conme3 = document.getElementById('contextmenu3');
let conme4 = document.getElementById('contextmenu4');

let previousClickedElement = null; //前回右クリックした要素を格納(灰色の背景を付与するため)

export const folderContextmenu = (tabIdArray) => {
  $('.folder').on('contextmenu click', function () {
    let folder = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };

    const currentClickedElement = folder.elem;
    if (previousClickedElement !== null) {
      previousClickedElement.style.backgroundColor = 'white';
    }

    currentClickedElement.style.backgroundColor = '#DCDCDC';
    currentClickedElement.style.borderRadius = '5px';
    previousClickedElement = currentClickedElement;

    document.addEventListener(
      'mousedown',
      (e) => {
        if (e.target !== currentClickedElement) {
          currentClickedElement.style.backgroundColor = 'white';
          previousClickedElement = null;
        }
      },
      { once: true }
    );

    const order = orderGet(
      `parent${folder.elem.parentNode.parentNode.id}`,
      folder.elem.parentNode.id
    );

    document.getElementById('folderDelete').onclick = async () => {
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
            //削除するファイルにlastCollapsableまたはlastExpandable(一番下の要素)がある　かつ　他に兄弟要素がある場合、treeviewのLineを更新
            if (
              (folder.elem.parentNode.classList.contains('lastCollapsable') ||
                folder.elem.parentNode.classList.contains('lastExpandable')) &&
              folder.elem.parentNode.parentNode.children.length > 1
            ) {
              const elementsBeforeMoving =
                folder.elem.parentNode.parentNode.firstElementChild;
              $(`#folder${folder.id}`).parent().remove();
              addLastClassToLastSibling(elementsBeforeMoving);
            } else {
              $(`#folder${folder.id}`).parent().remove();
            }

            //削除されたファイルのタブを削除する
            for (let i = 0; i < res.response.length; i++) {
              //idArrayが文字列で格納されているため、num→String変換
              if (tabIdArray.includes(res.response[i])) {
                closeTab(res.response[i], undefined, tabIdArray);
                //idArrayの中にあるlistTitle.idを削除
                tabIdArray = getTabIdArray();
              }
            }
            resultPopUp('フォルダ削除', '削除しました');
          },
        });
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
  });
};

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
  // document
  //   .getElementById('inputTab')
  //   .addEventListener('focus', (event) => event.target.select());
  // document.getElementById('inputTab').focus();
  focusAndAllSelections('inputTab');

  //Enter押下で変更する
  inputTab.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
      //何も入力されていない時や空白や改行のみの入力
      if (!inputTab.value || !inputTab.value.match(/\S/g)) {
        explanationPopUp('名前変更', '名前を変更してください');
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
  const removeInputAndRestoreFileElem = (e) => {
    if (e.target !== inputTab) {
      inputTab.remove();
      folder.elem.style.display = 'block';
      document.removeEventListener('mousedown', removeInputAndRestoreFileElem);
    }
  };
  document.addEventListener('mousedown', removeInputAndRestoreFileElem);
};

//rootの右クリックから「フォルダ新規作成」押下
document.getElementById('newfolder').onclick = async (e) => {
  const id = 0;
  e.stopPropagation();
  await newFolderCreateFunc(id);
};
