import { listCreate } from './main.js';

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

    let len = inputTab.value.length;
    document.getElementById('inputTab').focus();
    document.getElementById('inputTab').setSelectionRange(len, len);

    const clickL = (e) => {
      e.preventDefault();
      if (!e.target.closest('#inputTab')) {
        newCreateFile2(inputTab, span, id);
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };

    const clickR = (e) => {
      e.preventDefault();
      if (!e.target.closest('#inputTab')) {
        newCreateFile2(inputTab, span, id);
        document.removeEventListener('click', clickL);
        document.removeEventListener('contextmenu', clickR);
        document.removeEventListener('keypress', enter);
        resolve();
      }
    };

    const enter = (e) => {
      //e.preventDefault(); //これがあると入力できない？？
      if (e.keyCode === 13) {
        newCreateFile2(inputTab, span, id);
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

export const newCreateFile2 = (inputTab, span, parentId) => {
  //何も入力されていない時や空白や改行のみ
  if (!inputTab.value || !inputTab.value.match(/\S/g)) {
    alert('タイトルを入力してください');
  } else {
    $.ajax({
      url: '/notePostController/',
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

        let order = [].slice.call(elements).indexOf(span.parentNode);
        order++;

        $.ajax({
          url: '/notePostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'note',
            flg: 'newNote',
            pattern: 'order',
            id: res.response2.id,
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
};
