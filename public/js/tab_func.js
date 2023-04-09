//タブエリアの[保存]ボタン押下時
export const keepButton = (
  id,
  textarea,
  p1,
  fadeFont,
  inputKeep,
  inputCancel,
  inputEdit,
  time,
  newTitle,
  titletext
) => {
  let pass = passGet(id, newTitle);
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'note',
      flg: 'noteKeep',
      id,
      titleContent: newTitle, //p.innerHTML,
      memoContent: textarea.value, //ここに入力した値が入る
      pass,
    }),
    success: function (res) {
      //console.log(res.response2);
      fadeFont.style.visibility = 'visible';
      //1000ミリ秒後に表示を隠す
      setTimeout(function () {
        fadeFont.style.visibility = 'hidden';
        // updateTime.innerHTML = res.response2.saved_time;
      }, 1000);
    },
  });
  p1.remove();
  inputKeep.remove();
  inputCancel.remove();
  document.getElementById(`tabP${id}`).innerHTML = newTitle;
  document.getElementById(`tabP${id}`).style.display = 'block';
  document.getElementById(`tabname${id}`).innerHTML = newTitle;
  document.getElementById(`li${id}`).innerHTML = newTitle;
  titletext.remove();
  inputEdit.style.display = 'block';
  textarea.readOnly = true;
  updateTime(id, time);
  document.getElementById('notepass').innerHTML = pass;
};

//タブエリアの[取り消し]ボタン押下時
export const cancelButton = (
  id,
  p1,
  inputKeep,
  inputCancel,
  inputEdit,
  textarea,
  titletext
) => {
  let btn = confirm(
    '本当に編集を取り消しますか？\n保存していないものは取り消されます。'
  );
  if (btn) {
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'note',
        flg: 'info',
        id,
      }),
      success: function (res) {
        textarea.value = res.response.memo_text;
      },
    });
    document.getElementById(`tabP${id}`).style.display = 'block';
    p1.remove();
    inputKeep.remove();
    inputCancel.remove();
    titletext.remove();
    inputEdit.style.display = 'block';
    textarea.readOnly = true;
  }
};

//[共有する]ボタン押下時
export const shareButton = (id) => {
  aaa('やあ');
  let name = prompt('共有する相手のユーザー名を入力してください');
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'getuser',
      id,
      name,
    }),
    success: function (res) {
      alert(res.message);
    },
  });
};

//passを取得する関数
export const passGet = (id, title) => {
  let pass = document.getElementById(`li${id}`);
  let parentArray = [];
  let answer = '';
  let i = 0;

  while (pass.parentNode.parentNode.id != '0') {
    parentArray.push(
      pass.parentNode.parentNode.previousElementSibling.innerHTML
    );
    pass = pass.parentNode.parentNode.previousElementSibling;
  }
  parentArray.forEach((hoge) => {
    i++;
    if (i == parentArray.length) {
      answer = `  ${hoge}` + answer;
    } else {
      answer = ` > ${hoge}` + answer;
    }
  });
  return answer + ' > ' + title;
};

//現在日時取得＆DB格納
export const updateTime = (id, time) => {
  let now = new Date();
  let Year = now.getFullYear();
  let Month = now.getMonth() + 1;
  let DATE = now.getDate();
  let Hour = now.getHours();
  let Min = now.getMinutes();
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'note',
      flg: 'updatetime',
      id,
      time: `${Year}年${Month}月${DATE}日 ${Hour}:${Min}`,
    }),
    success: function (res) {
      //timeが空だと実行しない(ファイル作成時でtabを生成していないとき)
      if (time) time.innerHTML = res.response;
    },
  });
};

//タブ削除時に、focusの操作
export const closeTab = (id, index, tabFocus, tabArray) => {
  document.getElementById('TAB-ID' + id).remove();
  document.getElementById('tab-ID' + id).remove();
  document.getElementById('Tab-ID' + id).remove();

  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'tab',
      flg: 'tabDel',
      id,
      order: index,
    }),
    success: function (res) {},
  });
  if (tabFocus == undefined) {
    tabFocus = id;
  }
  //フォーカスがあっているタブを削除する際に他のタブへフォーカスを変更
  let result = tabArray.indexOf(id);
  if (id == tabFocus) {
    //tabArrayが０番目じゃない場合(上に他のタブがまだある場合)
    if (result != 0) {
      $(`#tab-ID${tabArray[result - 1]}`).trigger('click');
      //tabArrayの０番目の場合。タブの一番上の場合
    } else {
      $(`#tab-ID${tabArray[result + 1]}`).trigger('click');
    }
  }
};

//タブ上の✖️ボタン押下時
export const closeButton = (id, title, tabFocus, tabArray) => {
  let tabelements = document.getElementsByClassName('tab-content');
  let tabId = document.getElementById(`Tab-ID${id}`);
  let index = [].slice.call(tabelements).indexOf(tabId);
  index = index + 1;
  closeTab(id, index, tabFocus, tabArray);
  $.ajax({
    url: '/mypage/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      data: 'tab',
      flg: 'info',
      id,
      title,
    }),
    success: function (res) {},
  });
};

//タブクリック時
export const tabClick = (e, id, title, tabFocus) => {
  //タブの「✖️」ボタン以外押下時
  if (!e.target.closest('.buttonTab')) {
    var a = $(event.target).closest(`#button${id}`).length;
    if (a) {
      //nameをクリック
    } else {
      tabFocus = id;
    }
    //パスを取得する関数
    let pass = passGet(id, document.getElementById('tabname' + id).innerHTML);
    //クリックしたTabのfocusを1へ、その他を0へ。passも更新
    $.ajax({
      url: '/mypage/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        data: 'tab',
        flg: 'updateFocus',
        id,
        title,
        pass,
      }),
      success: function (res) {
        //console.log('タブクリックしたぞ(ajax)');
        document.getElementById('notepass').innerHTML = pass;
      },
    });
  } else {
    //タブ閉じるボタン押下
  }
};

//タブ削除したタイトルのIDをtabArrayから削除
export const deleteTabArray = (id, tabArray) => {
  tabArray = tabArray.filter((n) => n !== id);
  //タブを全削除したらnotabを表示。「ここにノートの情報が〜」のやつ
  if (tabArray.length == 0) {
    document.getElementById('notab').style.display = 'block';
    document.getElementById('notepass').innerHTML = '';
  }
  return tabArray;
};
