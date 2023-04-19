//タブで必要な関数まとめ

//タブ生成
export const tabCreate = (id, title, res) => {
  const inputTab = document.createElement('input');
  inputTab.setAttribute('id', 'TAB-ID' + id);
  inputTab.setAttribute('type', 'radio');
  inputTab.setAttribute('name', 'TAB');
  inputTab.setAttribute('class', 'tab-switch');
  inputTab.setAttribute('checked', 'checked');

  const labelTab = document.createElement('label');
  labelTab.setAttribute('class', 'tab-label');
  labelTab.setAttribute('id', 'tab-ID' + id);
  labelTab.setAttribute('for', 'TAB-ID' + id);
  labelTab.style.display = 'block';

  const tabname = document.createElement('p');
  tabname.setAttribute('class', 'tabname');
  tabname.setAttribute('id', 'tabname' + id);
  tabname.innerHTML = title;

  //[✖️]ボタン作成
  const buttonTab = document.createElement('button');
  buttonTab.setAttribute('class', 'buttonTab');
  buttonTab.setAttribute('id', 'button' + id);
  buttonTab.innerHTML = '×';

  // div要素を生成
  let div = document.createElement('div');
  div.className = 'tab-content';
  div.setAttribute('id', 'Tab-ID' + id);
  div.setAttribute('value', id);
  let div1 = document.createElement('div');
  div1.setAttribute('class', 'title');
  let p = document.createElement('p');
  p.setAttribute('class', 'title-txt');
  p.style.fontSize = '25px';
  p.style.color = 'black';
  p.style.textAlign = 'left';
  p.setAttribute('id', 'tabP' + id);
  let inputShare = document.createElement('input');
  inputShare.type = 'submit';
  inputShare.value = '共有する';
  let divFade = document.createElement('div');
  let div2 = document.createElement('div');
  div2.setAttribute('class', 'form-group');
  let textarea = document.createElement('textarea');
  textarea.readOnly = true;
  textarea.style.height = '500px';
  let inputEdit = document.createElement('input');
  inputEdit.type = 'submit';
  inputEdit.value = '編集する';
  p.innerHTML = res.title;
  textarea.innerHTML = res.memo_text;
  let fadeFont = document.createElement('p');
  fadeFont.setAttribute('class', 'fade-out-font');
  fadeFont.innerHTML = `保存が完了いたしました`;
  fadeFont.classList.add('fadeout');
  fadeFont.style.visibility = 'hidden';
  let time = document.createElement('p');
  time.setAttribute('class', 'updatetime');
  time.style.color = 'black';
  time.innerHTML = res.saved_time;

  //要素追加
  tab.appendChild(inputTab);
  tab.appendChild(labelTab);
  labelTab.appendChild(tabname);
  labelTab.appendChild(buttonTab);
  tab.appendChild(div);
  div.appendChild(div1);
  div.appendChild(divFade);
  div.appendChild(div2);
  div1.appendChild(p);
  div1.appendChild(inputShare);
  div2.appendChild(textarea);
  div.appendChild(inputEdit);
  divFade.appendChild(fadeFont);
  div.appendChild(time);

  return [inputEdit, div, textarea, fadeFont, time, inputShare, buttonTab];
};

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
    url: '/notePostController/',
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
      url: '/notePostController/',
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
    url: '/notePostController/',
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
    url: '/tabPostController/',
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
  const elements = document.getElementsByClassName('tab-label');
  for (let i = 0; i < elements.length; i++) {
    const style = window.getComputedStyle(elements[i]);
    console.log(style);
    if (style === 'white') {
      console.log(elements[i].innerHTML);
    }
  }

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
    url: '/tabPostController/',
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
      url: '/tabPostController/',
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
