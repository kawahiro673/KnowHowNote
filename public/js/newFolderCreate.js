import { jQueryUIOptionsFunc } from './jQueryUI_func.js';
import { folderContextmenu } from './folder_contextmenu.js';
import { listCreate } from './main.js';

export const newFolderCreateFunc = (
  id,
  folderInputExistFlg,
  fileInputExistFlg,
  tabIdArray
) => {
  return new Promise((resolve, reject) => {
    let li = document.createElement('li');
    li.setAttribute('class', 'closed');
    let span = document.createElement('span');
    span.setAttribute('class', 'folder');
    let ul = document.createElement('ul');
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

    const clickL = (e) => {
      e.preventDefault();
      if (folderInputExistFlg && !e.target.closest('#inputTab')) {
        newCreateFolder2(
          inputTab,
          span,
          li,
          ul,
          id,
          folderInputExistFlg,
          fileInputExistFlg,
          tabIdArray
        );
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };
    const clickR = (e) => {
      e.preventDefault();
      if (folderInputExistFlg && !e.target.closest('#inputTab')) {
        newCreateFolder2(
          inputTab,
          span,
          li,
          ul,
          id,
          folderInputExistFlg,
          fileInputExistFlg,
          tabIdArray
        );
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };
    const enter = (e) => {
      //e.preventDefault(); //これがあると入力できない？？
      if (folderInputExistFlg) {
        if (e.keyCode === 13) {
          newCreateFolder2(
            inputTab,
            span,
            li,
            ul,
            id,
            folderInputExistFlg,
            fileInputExistFlg,
            tabIdArray
          );
          document.removeEventListener('click', clickL);
          document.removeEventListener('contextmenu', clickR);
          document.removeEventListener('keypress', enter);
          resolve();
        }
      }
    };

    document.addEventListener('click', clickL);
    document.addEventListener('contextmenu', clickR);
    inputTab.addEventListener('keypress', enter);
  });
};

function newCreateFolder2(
  inputTab,
  span,
  li,
  ul,
  parentId,
  folderInputExistFlg,
  fileInputExistFlg,
  tabIdArray
) {
  //何も入力されていない時や空白や改行のみの入力
  if (!inputTab.value || !inputTab.value.match(/\S/g)) {
    alert('フォルダ名を入力してください');
  } else {
    $.ajax({
      url: '/folderPostController/',
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
        // jQueryUIOptionsFunc();
        // folderContextmenu(tabIdArray, fileInputExistFlg, folderInputExistFlg);
        $.ajax({
          url: '/folderPostController/',
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
