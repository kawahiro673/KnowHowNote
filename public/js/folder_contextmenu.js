import { closeTab, deleteTabArray } from './tab_func.js';

let tmp1;
let tmp2;

export const folderDelete = (folderList, index, tabArray, tabFocus) => {
  let btn = confirm(
    `${folderList.folderTitle} 配下のフォルダやノートも全て削除されますが本当に削除しますか？`
  );
  //はいを押した場合(true)
  if (btn) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'folder',
        flg: 'folderDel',
        id: folderList.folderId,
        title: folderList.folderTitle,
        order: index,
        parentId: folderList.folderThis.parentNode.parentNode.id,
      }),
      success: function (res) {
        //成功！！ここにリストから消した際のタブ削除と、リスト削除を記載→タブの✖️を押下したことにすれば良いのでは？？
        $(`#folder${res.response}`).parent().remove();

        $.ajax({
          url: '/mypage/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            data: 'childFolder',
            id: folderList.folderId,
            file: res.response1,
            folder: res.response2,
          }),
          success: function (res) {
            console.log(res.response);
            //削除されたファイルのタブを削除する
            for (let i = 0; i < res.response.length; i++) {
              //idArrayが文字列で格納されているため、num→String変換
              if (tabArray.includes(String(res.response[i]))) {
                closeTab(res.response[i], undefined, tabFocus, tabArray);
                //idArrayの中にあるlistTitle.idを削除
                tabArray = deleteTabArray(String(res.response[i]), tabArray);
              }
            }
          },
        });
      },
    });
  }
};

export const folderNameChange = () => {
  console.log('folderNameをクリックしました');
  //テキストの作成
  const inputTab = document.createElement('input');
  inputTab.setAttribute('type', 'text');
  inputTab.setAttribute('id', 'inputTab');
  inputTab.setAttribute('name', 'list_title');
  inputTab.setAttribute('maxlength', '20');
  inputTab.setAttribute('size', '20');
  inputTab.style.display = 'block';
  inputTab.setAttribute('value', folderList.folderTitle);

  folderList.folderThis.after(inputTab);
  folderList.folderThis.style.display = 'none';

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
            data: 'folder',
            flg: 'changeName',
            id: folderList.folderId,
            title: inputTab.value,
          }),
          success: function (res) {
            //console.log(`success受信(title) : "${res.response}"`);
            folderList.folderThis.style.display = 'block';
            folderList.folderThis.innerHTML = res.response;
            inputTab.remove();
          },
        });
      }
    }
  });
  tmp1 = inputTab;
  tmp2 = folderList.folderThis;
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
