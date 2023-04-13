import { closeTab, deleteTabArray } from './tab_func.js';

let tmp1;
let tmp2;

export const fileContextmenu = () => {
  $('.list_title').on('contextmenu', function () {
    console.log(
      `"${$(this).html()}" ${$(this).attr('value')} を右クリックしました`
    );
    let listTitle = {
      title: $(this).html(),
      id: $(this).attr('value'),
      titleThis: this,
    };

    listTitle.titleThis.style.backgroundColor = '#A7F1FF';
    listTitle.titleThis.style.borderRadius = '10px';

    let elements = document.getElementsByClassName(
      `parent${listTitle.titleThis.parentNode.parentNode.id}`
    );
    let index = [].slice.call(elements).indexOf(listTitle.titleThis.parentNode);
    index++;

    document.getElementById('delete').onclick = () => {
      let tabIndex = orderGet('tab-content', `Tab-ID${listTitle.id}`);
      noteDelete(listTitle, tabIndex, index, tabArray, tabFocus);
    };

    $(document).ready(function () {
      $('#name').off('click');
      $('#name').on('click', function (event) {
        noteNameChange(listTitle);
      });
    });

    $(document).ready(function () {
      //重複してしまうため色変更イベントを一時削除
      $('#color').off('click');
      $('#color').on('click', function (event) {
        event.preventDefault();
        noteColorChange(listTitle);
      });
    });

    document.addEventListener(
      'mousedown',
      (e) => {
        let flg = false;
        if (e.target == listTitle.titleThis) flg = true;
        bodyClickJuge(listTitle.titleThis, null, flg, 'backgroundColor');
      },
      { once: true }
    );
  });
};

export const noteDelete = (listTitle, tabIndex, index, tabArray, tabFocus) => {
  //はいを押した場合(true)
  //まずはタブ削除
  let btn = confirm(`${listTitle.title} を本当に削除しますか？`);
  if (btn) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'tabDel',
        id: listTitle.id,
        order: tabIndex,
      }),
      success: function (res) {
        //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？
        let parentid = listTitle.titleThis.parentNode.parentNode.id;
        $(`#li${listTitle.id}`).parent().remove();

        listTitle.id = Number(listTitle.id);
        if (tabArray.includes(listTitle.id)) {
          closeTab(listTitle.id, tabIndex, tabFocus, tabArray);
          //idArrayの中にあるlistTitle.idを削除
          tabArray = deleteTabArray(listTitle.id, tabArray);
        }

        $.ajax({
          url: '/mypage/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'note',
            flg: 'delete',
            id: listTitle.id,
            order: index,
            parentId: parentid,
          }),
          success: function (res) {
            console.log(`${res.response}を削除しました`);
          },
        });
      },
    });
  }
};

export const noteNameChange = (listTitle) => {
  console.log('nameをクリックしました');
  //テキストの作成
  const inputTab = document.createElement('input');
  inputTab.setAttribute('type', 'text');
  inputTab.setAttribute('id', 'inputTab');
  inputTab.setAttribute('name', 'list_title');
  inputTab.setAttribute('maxlength', '20');
  inputTab.setAttribute('size', '20');
  inputTab.style.display = 'block';
  inputTab.setAttribute('value', listTitle.title);

  listTitle.titleThis.after(inputTab);
  listTitle.titleThis.style.display = 'none';

  //テキストエリアにフォーカスを当ててカーソルを末尾へ
  let len = inputTab.value.length;
  document.getElementById('inputTab').focus();
  document.getElementById('inputTab').setSelectionRange(len, len);

  //Enter押下で変更する
  inputTab.addEventListener('keypress', function (e) {
    //Enter判定
    if (e.keyCode === 13) {
      //何も入力されていない時や空白や改行のみの入力
      if (!inputTab.value || !inputTab.value.match(/\S/g)) {
        alert('タイトルを入力してください');
      } else {
        $.ajax({
          url: '/mypage/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'note',
            flg: 'name',
            id: listTitle.id,
            title: inputTab.value,
            oldTitle: listTitle.title, //変更前のタイトル
          }),
          success: function (res) {
            //console.log(`success受信(title) : "${res.response1}"`);

            listTitle.titleThis.style.display = 'block';
            listTitle.titleThis.innerHTML = res.response1;
            inputTab.remove();
            //タブが生成済みの場合
            if (res.response2 != undefined) {
              //リアルタイムにタイトル更新
              document.getElementById(`tabname${listTitle.id}`).innerHTML =
                res.response1;

              document.getElementById(`tabP${listTitle.id}`).innerHTML =
                res.response1;

              //passを正しく表示する2点セット
              //1.focusが当たってたらパス更新
              if (res.response3 == 1) {
                document.getElementById('notepass').innerHTML = res.response2;
              }
              //2.タブクリック時にパス更新
              document.getElementById(`tab-ID${listTitle.id}`).onclick =
                function (e) {
                  document.getElementById('notepass').innerHTML = res.response2;
                };
            }
          },
        });
      }
    }
  });
  tmp1 = inputTab;
  tmp2 = listTitle.titleThis;
  document.addEventListener('mousedown', eventFunc);
};

//わからん。。。。nameクリック後の判定が、、、、なぜか上手くいく。。
function eventFunc(e) {
  let flg = false;
  if (e.target == tmp1) flg = true;
  bodyClickJuge(tmp1, tmp2, flg, 'input');
}

//右・左クリック時にいろんなものを消したり戻したり。。。
export const bodyClickJuge = (target1, target2, flg1, flg2) => {
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

export const noteColorChange = (listTitle) => {
  console.log('colorクリック!');
  //タイトルが赤色だった場合
  if (listTitle.titleThis.style.color == 'red') {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'color',
        id: listTitle.id,
        color: 'black',
      }),
      success: function (res) {
        console.log(`success受信(color) : "${res.response}"`);
        listTitle.titleThis.style.color = res.response;
      },
    });
    //タイトルが黒の場合に実行
  } else {
    console.log('blackの場合');
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'color',
        id: listTitle.id,
        color: 'red',
      }),
      success: function (res) {
        console.log(`success受信(color) : "${res.response}"`);
        listTitle.titleThis.style.color = res.response;
      },
    });
  }
};
