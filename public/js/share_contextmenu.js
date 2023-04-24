import { jQueryUIOptionsFunc } from './jQueryUI_func.js';
import { fileContextmenu } from './note_contextmenu.js';
import { updateTime } from './tab_func.js';
import { listCreate, fileClick } from './main.js';

export const shareContextmenu = (tabIdArray) => {
  $('.sharenote').on('contextmenu', function () {
    console.log(`"${$(this).html()}" を右クリックしました`);
    let share = {
      shareTitle: $(this).html(),
      id: $(this).attr('value'),
      shareThis: this,
    };
    console.log($(this).attr('value'));
    console.log(share.id);
    $(document).ready(function () {
      $('#MyNoteAdd').off('click');
      $('#MyNoteAdd').on('click', function (event) {
        mynoteAddFunc(share.id, tabIdArray);
      });
    });
  });
};

const mynoteAddFunc = (id, tabIdArray) => {
  console.log(typeof id);
  $.ajax({
    url: '/sharePostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'shareAdd',
      id,
    }),
    success: function (res) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      li.setAttribute('class', 'last');
      li.setAttribute('class', `parent0`);
      span.classList.add('list_title', 'file');

      span.setAttribute('id', `li${res.response.id}`);
      span.setAttribute('value', res.response.id);
      span.innerHTML = res.response.title;

      document.getElementById('0').appendChild(li);
      li.appendChild(span);

      let elements = document.getElementsByClassName(`parent0`);
      //MyPage追加後の順番
      let order = [].slice.call(elements).indexOf(span.parentNode);
      order++;
      jQueryUIOptionsFunc();
      fileContextmenu(tabIdArray);
      fileClick();
      updateTime(res.response.id);
      $.ajax({
        url: '/notePostController/',
        type: 'POST',
        dataType: 'Json',
        contentType: 'application/json',
        data: JSON.stringify({
          data: 'note',
          flg: 'newNote',
          pattern: 'order',
          id: res.response.id,
          order,
        }),
        success: function (res) {
          console.log(res.response);
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
};
