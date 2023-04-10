import {
  keepButton,
  cancelButton,
  shareButton,
  passGet,
  updateTime,
  closeTab,
  closeButton,
  tabClick,
  deleteTabArray,
  tabCreate,
} from './tab_func.js';

export const notedelete = (listTitle, tabIndex, index, tabArray, tabFocus) => {
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

let tmp1;
let tmp2;

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
function bodyClickJuge(target1, target2, flg1, flg2) {
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
}
