export const expandableAdaptation = (expandableArray) => {
  //時間差でclosedのoffを開く＆フォルダ押下時にclick
  return new Promise((resolve, reject) => {
    expandableArray.forEach((ex) => {
      document.getElementById(`folder${ex}`).click();
    });

    let folder = document.getElementsByClassName('folder');
    for (let i = 0; i < folder.length; i++) {
      folder[i].addEventListener('click', function () {
        let closedFlg = 0;

        //folderが閉じているとflg=1
        if (this.parentNode.classList.contains('expandable')) {
          closedFlg = 1;
        }

        $.ajax({
          url: '/folderPostController/',
          type: 'POST',
          dataType: 'Json',
          contentType: 'application/json',
          data: JSON.stringify({
            flg: 'closed',
            id: this.id.replace(/[^0-9]/g, ''),
            closedFlg,
          }),
          success: function (res) {},
        });
      });
    }
    resolve();
  });
};

//[折り畳む]ボタン押下後、DB全て折り畳む値追加
$('.collapsable').click(function () {
  $.ajax({
    url: '/folderPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'collapsableALL',
    }),
    success: function (res) {},
  });
});

//[展開する]ボタン押下、DB全て展開する値追加
$('.expandable').click(function () {
  $.ajax({
    url: '/folderPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'expandableALL',
    }),
    success: function (res) {},
  });
});
