import { listCreate } from '../main.js';
import { resultPopUp, answerPopUp } from '../stringUtils.js';

export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu  click', function (event) {
    const share = {
      shareTitle: $(this).html(),
      id: $(this).attr('value'),
      shareThis: this,
    };

    //[マイノートへ追加する]押下時
    //$(document).ready(function () {
    //   $('#MyNoteAdd').off('click');
    //   $('#MyNoteAdd').on('click', function (e) {
    //     console.log('上の関数です');
    //     const li = share.shareThis.parentElement;
    //     const ul = li.parentElement;
    //     ul.removeChild(li);
    //     mynoteAddFunc(share.id);
    //   });
    // });

    // document
    //   .getElementById('Add-from-Details')
    //   .addEventListener('click', () => {
    //     console.log('下の関数です');
    //     const li = share.shareThis.parentElement;
    //     const ul = li.parentElement;
    //     ul.removeChild(li);
    //     mynoteAddFunc(share.id);
    //   });

      //[マイノートへ追加する]押下時のイベントリスナーは一度だけ設定
    $('#MyNoteAdd').off('click').on('click', () => {
      console.log('上の関数です');
      const li = share.shareThis.parentElement;
      const ul = li.parentElement;
      ul.removeChild(li);
      mynoteAddFunc(share.id);
    });

    // document
    //   .getElementById('Add-from-Details')
    //   .addEventListener('click', () => {
    //     console.log('下の関数です');
    //     const li = share.shareThis.parentElement;
    //     const ul = li.parentElement;
    //     ul.removeChild(li);
    //     mynoteAddFunc(share.id);
    //   });

    (async () => {
      try {
        const shareInfo = await getShareUser(share.id);
        document.getElementById('share-user-contenxtmenu').innerHTML =
          shareInfo.Share_User;
        document.getElementById('share-message').innerHTML = shareInfo.Message;
        document.getElementById('share-time').innerHTML = shareInfo.saved_time;
      } catch (error) {
        console.error(error);
      }
    })();

    //シャアノウハウ削除
    $(document).ready(function () {
      $('#share-list-delete').off('click');
      $('#share-list-delete').on('click', async function (e) {
        const result = await answerPopUp(
          'シェアノウハウ削除',
          `"${share.shareTitle}"を削除しますがよろしいですか`
        );
        if (result === true) {
          $.ajax({
            url: '/sharePostController/',
            type: 'POST',
            dataType: 'Json',
            contentType: 'application/json',
            data: JSON.stringify({
              flg: 'share-delete',
              id: share.id,
            }),
            success: function (res) {
              document.getElementById(
                'popup-overlay_share-delete'
              ).style.display = 'none';
              resultPopUp('共有ノウハウ削除', '削除しました');
              document.getElementById('share-list-update-button').click();
            },
          });
        } else {
          // 「いいえ」が押された場合の処理 おそらくポップが閉じる
        }
      });
    });
  });
};

const mynoteAddFunc = (id) => {
  $.ajax({
    url: '/sharePostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'shareAdd',
      id,
    }),
    success: function (res) {
      //一度listを全て削除して、再び新しく追加している→jQueryUIがうまく適用されないため
      const node = document.getElementById('0');
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      listCreate();
      resultPopUp('共有ノウハウ追加', 'マイノウハウへ追加しました');
    },
  });
};

const getShareUser = async (id) => {
  try {
    const response = await $.ajax({
      url: '/sharePostController/',
      type: 'POST',
      dataType: 'Json',
      contentType: 'application/json',
      data: JSON.stringify({
        flg: 'shareNoteInfoGet',
        id,
      }),
    });
    return response.fileResult;
  } catch (error) {
    // エラーハンドリング
    console.error(error);
    throw error;
  }
};
