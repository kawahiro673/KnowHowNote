import { listCreate } from './main.js';
import { orderGet, currentTimeGet } from './stringUtils.js';
import { hasInput, disableElements } from './utilityFunction.js';

export const newFileCreateFunc = (id) => {
  return new Promise((resolve, reject) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
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

    const order = getInputOrder('inputTab');
    console.log(order);

    let isCreatingFile = false; // ファイル作成中かどうかを示すフラグ

    // inputにフォーカスを当てて全選択
    inputTab.addEventListener('focus', (event) => event.target.select());
    inputTab.focus();

    const createFile = async () => {
      if (!isCreatingFile) {
        isCreatingFile = true; // ファイル作成中フラグを立てる
        await newCreateFile2(inputTab, span, id, li, order);
        document.removeEventListener('click', handleClick);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keypress', handleEnter);

        resolve();
      }
    };

    const handleClick = (e) => {
      if (!e.target.closest('#inputTab')) {
        createFile();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      if (!e.target.closest('#inputTab')) {
        createFile();
      }
    };

    const handleEnter = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        if (!isCreatingFile) {
          createFile();
        }
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);
    inputTab.addEventListener('keypress', handleEnter);
  });
};
export const newCreateFile2 = (inputTab, span, parentId, li, order) => {
  return new Promise((resolve, reject) => {
    //何も入力されていない時や空白や改行のみ
    if (!inputTab.value || !inputTab.value.match(/\S/g)) {
      alert('タイトルを入力してください');
    } else {
      const time = currentTimeGet();
      $.ajax({
        url: '/notePostController/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          flg: 'newNote',
          pattern: 'new',
          title: inputTab.value,
          parentId,
          time,
          order,
        }),
        success: function (res) {
          // li.setAttribute('id', `li${res.fileResult.id}`);
          // span.setAttribute('id', `file${res.fileResult.id}`);
          // span.setAttribute('value', res.fileResult.id);
          // inputTab.remove();
          // span.innerHTML = inputTab.value;
          // span.parentNode.setAttribute(
          //   'class',
          //   `parent${res.fileResult.parent_id}`
          // );

          // const order = orderGet(
          //   `parent${res.fileResult.parent_id}`,
          //   `li${res.fileResult.id}`
          // );

          // $.ajax({
          //   url: '/notePostController/',
          //   type: 'POST',
          //   dataType: 'Json',
          //   contentType: 'application/json',
          //   data: JSON.stringify({
          //     flg: 'newNote',
          //     pattern: 'order',
          //     id: res.fileResult.id,
          //     order,
          //   }),
          //   success: function (res) {
              //一度listを全て削除して、再び新しく追加している→jQueryUIがうまく適用されないため
              const node = document.getElementById('0');
              while (node.firstChild) {
                node.removeChild(node.firstChild);
              }
              document.getElementById('list_loader').style.display = 'block'; //listCreateで消す
              listCreate();
              resolve();
            //},
          //});
        },
      });
    }
  });
};

//「ノート追加」ボタン押下時(root(id=0)に作成)
// hasInputは、input要素の有無を確認している
createfilebutton.addEventListener('click', async (e) => {
  const root = hasInput(document.getElementById('0'));
  if (!root) {
    const id = 0;
    disableElements();
    e.stopPropagation();
    //awaitはPromiseが返ってくるまで待つ。関数内でPromise化し、resolveのタイミングでPromiseが返る
    await newFileCreateFunc(id);
  }
});

//ノウハウ作成時に生成されたinput(親のli要素)が、同階層で上から何番目(order)に作成されたかを返す関数
export const getInputOrder = (inputId) => {
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    const liParentElement = inputElement.closest('li');
    if (liParentElement) {
      let order = 1;
      let currentElement = liParentElement.previousElementSibling;

      while (currentElement) {
        if (currentElement.tagName === 'LI') {
          order++;
        }
        currentElement = currentElement.previousElementSibling;
      }
      return order;
    }
  }
  return -1; // 要素が見つからなかった場合に-1を返す、エラー処理を追加
};
