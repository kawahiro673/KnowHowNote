import { listCreate } from './main.js';

export const newFolderCreateFunc = (id) => {
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
      if (!e.target.closest('#inputTab')) {
        newCreateFolder2(inputTab, span, li, ul, id);
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };
    const clickR = (e) => {
      e.preventDefault();
      if (!e.target.closest('#inputTab')) {
        newCreateFolder2(inputTab, span, li, ul, id);
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };
    const enter = (e) => {
      //e.preventDefault(); //これがあると入力できない？？

      if (e.keyCode === 13) {
        newCreateFolder2(inputTab, span, li, ul, id);
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };

    document.addEventListener('click', clickL);
    document.addEventListener('contextmenu', clickR);
    inputTab.addEventListener('keypress', enter);
  });
};

function newCreateFolder2(inputTab, span, li, ul, parentId) {
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
        span.setAttribute('id', `folder${res.folderResults.id}`);
        span.setAttribute('value', res.folderResults.id);
        inputTab.remove();
        span.innerHTML = inputTab.value;
        li.appendChild(ul);
        span.parentNode.setAttribute(
          'class',
          `parent${res.folderResults.parent_id}`
        );
        let elements = document.getElementsByClassName(
          `parent${res.folderResults.parent_id}`
        );
        //newIndex は並び替え(D&D) 後の配列の順番
        let order = [].slice.call(elements).indexOf(span.parentNode);
        order++;

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
            id: res.folderResults.id,
            order,
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
