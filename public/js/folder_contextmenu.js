import { closeTab, deleteTabArray } from './tab_func.js';

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
