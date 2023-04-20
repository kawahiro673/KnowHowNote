import { jQueryUIOptionsFunc } from './jQueryUI_func.js';
import { folderContextmenu } from './folder_contextmenu.js';
import { listCreate } from './main.js';

export const newFolderCreateFunc = (id, folderFlg, fileFlg, tabArray) => {
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
      newCreateFolder2(
        inputTab,
        span,
        li,
        ul,
        id,
        folderFlg,
        fileFlg,
        tabArray
      );
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
      newCreateFolder2(
        inputTab,
        span,
        li,
        ul,
        id,
        folderFlg,
        fileFlg,
        tabArray
      );
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
        newCreateFolder2(
          inputTab,
          span,
          li,
          ul,
          id,
          folderFlg,
          fileFlg,
          tabArray
        );
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

  return folderFlg;
};

function newCreateFolder2(
  inputTab,
  span,
  li,
  ul,
  parentId,
  folderFlg,
  fileFlg,
  tabArray
) {
  //何も入力されていない時や空白や改行のみの入力
  if (!inputTab.value || !inputTab.value.match(/\S/g)) {
    alert('フォルダ名を入力してください');
  } else {
    console.log('入力されました');
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
        jQueryUIOptionsFunc();
        folderContextmenu(tabArray, fileFlg, folderFlg);
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
