import { listCreate } from './main.js';

export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu', function () {
    console.log(`"${$(this).html()}" を右クリックしました`);
    let share = {
      shareTitle: $(this).html(),
      id: $(this).attr('value'),
      shareThis: this,
    };

    //[マイノートへ追加する]押下時
    $(document).ready(function () {
      $('#MyNoteAdd').off('click');
      $('#MyNoteAdd').on('click', function (e) {
        console.log(this);
        share.shareThis.parentNode.removeChild(share.shareThis);
        mynoteAddFunc(share.id);
      });
    });
  });
};

const mynoteAddFunc = (id) => {
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

      span.setAttribute('id', `file${res.fileResult.id}`);
      span.setAttribute('value', res.fileResult.id);
      span.innerHTML = res.fileResult.title;

      document.getElementById('0').appendChild(li);
      li.appendChild(span);

      let elements = document.getElementsByClassName(`parent0`);
      //MyPage追加後の順番
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
          id: res.fileResult.id,
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
};
