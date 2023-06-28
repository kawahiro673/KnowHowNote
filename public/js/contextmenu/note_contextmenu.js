import { closeTab, deleteTabArray } from '../tab_func.js';
import { currentTimeGet, orderGet } from '../stringUtils.js';
import { tabFocusIDGet } from '../main.js';
//import { nameChangeStringChange } from '../utilityFunction.js';
import { newFileCreateFunc } from '../newFileCreate.js';

let tmp1;
let tmp2;

export const fileContextmenu = (tabIdArray) => {
  $('.list_title').on('contextmenu', function () {
    let file = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };

    file.elem.style.backgroundColor = '#A7F1FF';
    file.elem.style.borderRadius = '10px';

    const order = orderGet(
      `parent${file.elem.parentNode.parentNode.id}`,
      file.elem.parentNode.id
    );

    document.getElementById('delete').onclick = () => {
      let tabIndex = orderGet('tab-content', `Tab-ID${file.id}`);
      noteDelete(file, tabIndex, order, tabIdArray);
    };

    $(document).ready(function () {
      $('#name').off('click');
      $('#name').on('click', function (event) {
        noteNameChange(file);
      });
    });

    document.addEventListener(
      'mousedown',
      (e) => {
        let flg = false;
        if (e.target == file.elem) flg = true;
        bodyClickJuge(file.elem, null, flg, 'backgroundColor');
      },
      { once: true }
    );

    $(document).ready(function () {
      $('#pink_n').off('click');
      $('#pink_n').on('click', function (event) {
        fileColorUpdate(file.id, '#FF00FF');
      });
    });
    $(document).ready(function () {
      $('#red_n').off('click');
      $('#red_n').on('click', function (event) {
        fileColorUpdate(file.id, '#FF0000');
      });
    });
    $(document).ready(function () {
      $('#orange_n').off('click');
      $('#orange_n').on('click', function (event) {
        fileColorUpdate(file.id, '#FFA500');
      });
    });
    $(document).ready(function () {
      $('#yellow_n').off('click');
      $('#yellow_n').on('click', function (event) {
        fileColorUpdate(file.id, '#FFFF00');
      });
    });
    $(document).ready(function () {
      $('#yellow-green_n').off('click');
      $('#yellow-green_n').on('click', function (event) {
        fileColorUpdate(file.id, '#98FB98');
      });
    });
    $(document).ready(function () {
      $('#green_n').off('click');
      $('#green_n').on('click', function (event) {
        fileColorUpdate(file.id, '#228B22');
      });
    });
    $(document).ready(function () {
      $('#sky-blue_n').off('click');
      $('#sky-blue_n').on('click', function (event) {
        fileColorUpdate(file.id, '#AFEEEE');
      });
    });
    $(document).ready(function () {
      $('#blue_n').off('click');
      $('#blue_n').on('click', function (event) {
        fileColorUpdate(file.id, '#0000FF');
      });
    });
    $(document).ready(function () {
      $('#purple_n').off('click');
      $('#purple_n').on('click', function (event) {
        fileColorUpdate(file.id, '#800080');
      });
    });
    $(document).ready(function () {
      $('#brown_n').off('click');
      $('#brown_n').on('click', function (event) {
        fileColorUpdate(file.id, '#B8860B');
      });
    });
    $(document).ready(function () {
      $('#gray_n').off('click');
      $('#gray_n').on('click', function (event) {
        fileColorUpdate(file.id, '#A9A9A9');
      });
    });
    $(document).ready(function () {
      $('#black_n').off('click');
      $('#black_n').on('click', function (event) {
        fileColorUpdate(file.id, '#000000');
      });
    });
    $(document).ready(function () {
      $('#white_n').off('click');
      $('#white_n').on('click', function (event) {
        fileColorUpdate(file.id, '#FFFFFF');
      });
    });
  });
};

const noteDelete = (file, tabIndex, order, tabIdArray) => {
  //まずはタブ削除
  let btn = confirm(`${file.title} を本当に削除しますか？`);

  if (btn) {
    if (tabIdArray.includes(Number(file.id))) {
      closeTab(Number(file.id), tabIndex, tabIdArray);
      //idArrayの中にあるfile.idを削除
      tabIdArray = deleteTabArray(file.id, tabIdArray);
    }
    $.ajax({
      url: '/tabPostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'tabDelete',
        id: file.id,
        order: tabIndex,
      }),
      success: function (res) {
        //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？
        let parentid = file.elem.parentNode.parentNode.id;
        $(`#file${file.id}`).parent().remove();

        $.ajax({
          url: '/notePostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            flg: 'delete',
            id: file.id,
            order,
            parentId: parentid,
          }),
          success: function (res) {},
        });
      },
    });
  }
};

const noteNameChange = (file) => {
  const inputTab = document.createElement('input');
  inputTab.setAttribute('type', 'text');
  inputTab.setAttribute('id', 'inputTab');
  inputTab.setAttribute('name', 'list_title');
  inputTab.setAttribute('maxlength', '20');
  inputTab.setAttribute('size', '20');
  inputTab.style.display = 'block';
  inputTab.setAttribute('value', file.title);

  file.elem.after(inputTab);
  file.elem.style.display = 'none';

  //inputにフォーカスを当てて全選択
  document
    .getElementById('inputTab')
    .addEventListener('focus', (event) => event.target.select());
  document.getElementById('inputTab').focus();

  //Enter押下で変更する
  inputTab.addEventListener('keypress', function (e) {
    //Enter判定
    if (e.keyCode === 13) {
      //何も入力されていない時や空白や改行のみの入力
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
            flg: 'name',
            id: file.id,
            title: inputTab.value,
            oldTitle: file.title, //変更前のタイトル
            time,
          }),
          success: function (res) {
            file.elem.style.display = 'block';
            file.elem.innerHTML = inputTab.value;
            inputTab.remove();
            // setTimeout(() => {
            //   nameChangeStringChange('file', Number(file.id));
            // }, 1500);

            //タブが生成済みの場合リアルタイムにタイトル更新(タブも)
            if (res.tabResult !== null) {
              document.getElementById(`tabname${file.id}`).innerHTML =
                inputTab.value;
              document.getElementById(`tabP${file.id}`).innerHTML =
                inputTab.value;
            }
            //ファイルの名前変更時にパス更新
            const tabFocusID = tabFocusIDGet();
            if (tabFocusID === Number(file.id)) {
              $(`#tab-ID${tabFocusID}`).trigger('click');
            }
          },
        });
      }
    }
  });
  tmp1 = inputTab;
  tmp2 = file.elem;
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
    //console.log('同じ要素です');
  } else {
    //console.log('違う要素です');
    if (flg2 == 'backgroundColor') {
      target1.style.backgroundColor = 'white';
    } else if (flg2 == 'input') {
      target1.remove();
      target2.style.display = 'block';
    }
  }
};

const fileColorUpdate = (id, color) => {
  document.getElementById(`file${id}`).style.color = color;
  $.ajax({
    url: '/notePostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'fileColorChange',
      id,
      color,
    }),
    success: function (res) {},
  });
};

//rootの右クリックから「ファイル新規作成」押下
document.getElementById('newfile').onclick = async (e) => {
  const id = 0;
  e.stopPropagation();
  await newFileCreateFunc(id);
};
