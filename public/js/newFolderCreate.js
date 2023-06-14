import { listCreate } from './main.js';
import { orderGet } from './stringUtils.js';
import {
  hasInput,
  disableElements,
  enableElements,
} from './utilityFunction.js';

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

    let isCreatingFolder = false; // フォルダ作成中かどうかを示すフラグ

    // inputにフォーカスを当てて全選択
    inputTab.addEventListener('focus', (event) => event.target.select());
    inputTab.focus();

    const createFolder = () => {
      if (!isCreatingFolder) {
        isCreatingFolder = true; // フォルダ作成中フラグを立てる
        newCreateFolder2(inputTab, span, li, ul, id);
        document.removeEventListener('click', handleClick);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keypress', handleEnter);
        resolve();
      }
    };

    const handleClick = (e) => {
      if (!e.target.closest('#inputTab')) {
        createFolder();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      if (!e.target.closest('#inputTab')) {
        createFolder();
      }
    };

    const handleEnter = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        if (!isCreatingFolder) {
          createFolder();
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    inputTab.addEventListener('keypress', handleEnter);
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
        flg: 'newFolder',
        pattern: 'new',
        folderName: inputTab.value,
        parentId,
      }),
      success: function (res) {
        li.setAttribute('id', `foli${res.folderResults.id}`);
        span.setAttribute('id', `folder${res.folderResults.id}`);
        span.setAttribute('value', res.folderResults.id);
        inputTab.remove();
        span.innerHTML = inputTab.value;
        li.appendChild(ul);
        span.parentNode.setAttribute(
          'class',
          `parent${res.folderResults.parent_id}`
        );

        const order = orderGet(
          `parent${res.folderResults.parent_id}`,
          `foli${res.folderResults.id}`
        );

        $.ajax({
          url: '/folderPostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
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

//「フォルダ追加」ボタン押下時(root(id=0)に作成)
createbutton.addEventListener(
  'click',
  async (e) => {
    const root = hasInput(document.getElementById('0'));
    if (!root) {
      const id = 0;
      disableElements();
      e.stopPropagation();
      await newFolderCreateFunc(id);
      document.getElementById('list_loader').style.display = 'block';
      document.getElementById('list_loader').classList.add('loaded');
    }
  },
  false
);
