import { closeTab, shareButtonClick } from '../tab_func.js';
import {
  currentTimeGet,
  orderGet,
  resultPopUp,
  answerPopUp,
  explanationPopUp,
} from '../stringUtils.js';
import { tabFocusIDGet, getTabIdArray } from '../main.js';
import { newFileCreateFunc } from '../newFileCreate.js';
import { addLastClassToLastSibling } from '../treeviewLineUpdate.js';

// let tmp1;
// let tmp2;

let previousClickedElement = null;

export const fileContextmenu = (tabIdArray) => {
  $('.list_title').on('contextmenu', function () {
    let file = {
      title: $(this).html(),
      id: $(this).attr('value'),
      elem: this,
    };
/*******************************************************************/
    // file.elem.style.backgroundColor = '#F5F5F5';
    // file.elem.style.borderRadius = '5px';
    
   const currentClickedElement = file.elem;

   if (previousClickedElement !== null) {
      previousClickedElement.style.backgroundColor = 'white';
    }
    
    currentClickedElement.style.backgroundColor = '#DCDCDC';
    currentClickedElement.style.borderRadius = '5px';
    previousClickedElement = currentClickedElement;

    document.addEventListener(
      'mousedown',
      (e) => {
        console.log('やあ');
        //let flg = false;
        //if (e.target == file.elem) flg = true;
        //bodyClickJuge(file.elem, null, flg, 'backgroundColor');
      if (e.target !== currentClickedElement) {
        currentClickedElement.style.backgroundColor = 'white';
        previousClickedElement = null;
      }
      }
    //  { once: true }
    );
/*******************************************************************/
    
    const order = orderGet(
      `parent${file.elem.parentNode.parentNode.id}`,
      file.elem.parentNode.id
    );

    document.getElementById('delete').onclick = async () => {
      let tabOrder = orderGet('tab-content', `Tab-ID${file.id}`);

      const result = await answerPopUp(
        'ノウハウ削除',
        `"${file.title}"を削除しますがよろしいですか`
      );
      if (result === true) {
        //タブが生成済みであれば、タブを削除
        if (tabIdArray.includes(Number(file.id))) {
          closeTab(Number(file.id), tabOrder, tabIdArray);
          //idArrayの中にあるfile.idを削除
          tabIdArray = getTabIdArray();
        }
        const parentId = file.elem.parentNode.parentNode.id;
        $.ajax({
          url: '/notePostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            flg: 'delete',
            id: file.id,
            tabOrder,
            fileOrder: order,
            parentId,
          }),
          success: function (res) {
            //削除するファイルにlast(一番下の要素)がある　かつ　他に兄弟要素がある場合、treeviewのLineを更新
            if (
              file.elem.parentNode.classList.contains('last') &&
              file.elem.parentNode.parentNode.children.length > 1
            ) {
             const elementsBeforeMoving =
                file.elem.parentNode.parentNode.firstElementChild;
              $(`#file${file.id}`).parent().remove();
              addLastClassToLastSibling(elementsBeforeMoving);
            } else {
              $(`#file${file.id}`).parent().remove();
            }
            resultPopUp('ノウハウ削除', '削除しました');
          },
        });
      } 
    };

    $(document).ready(function () {
      $('#name').off('click');
      $('#name').on('click', function (event) {
        noteNameChange(file);
      });
    });

    $(document).ready(function () {
      $('#file-share').off('click');
      $('#file-share').on('click', function (event) {
        shareButtonClick(file.id, 'contextmenu');
      });
    });

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
        explanationPopUp('名前変更', '名前を変更してください');
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
  document.addEventListener('mousedown', function (e) {
    console.log('ひん');
    inputTab.remove()
    file.elem.style.display = 'block';
  });
  // tmp1 = inputTab;
  // tmp2 = file.elem;
  // document.addEventListener('mousedown', eventFunc);
};

//わからん。。。。nameクリック後の判定が、、、、なぜか上手くいく。。
// function eventFunc(e) {
//   let flg = false;
//   if (e.target == tmp1) flg = true;
//   bodyClickJuge(tmp1, tmp2, flg, 'input');
// }

//右・左クリック時にいろんなものを消したり戻したり。。。
// const bodyClickJuge = (target1, target2, flg1, flg2) => {
//   if (flg1) {
//     console.log('同じ要素です');
//   } else {
//     console.log('違う要素です');
//     if (flg2 == 'backgroundColor') {
//       target1.style.backgroundColor = 'white';
//     } else if (flg2 == 'input') {
//       target1.remove();
//       target2.style.display = 'block';
//     }
//   }
// };

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
  e.stopPropagation();
  const id = 0;
  await newFileCreateFunc(id);
};
