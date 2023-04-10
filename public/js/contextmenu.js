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
