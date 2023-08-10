import { listCreate } from '../main.js';
import { resultPopUp } from '../stringUtils.js';
import { getInputOrder } from '../utilityFunction.js';

export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu  click', function (event) {
    let share = {
      shareTitle: $(this).html(),
      id: $(this).attr('value'),
      shareThis: this,
    };

    //[マイノートへ追加する]押下時
    $(document).ready(function () {
      $('#MyNoteAdd').off('click');
      $('#MyNoteAdd').on('click', function (e) {
        // share.shareThis.parentNode.removeChild(share.shareThis);
        const li = share.shareThis.parentElement;
        const ul = li.parentElement;
        ul.removeChild(li);
        mynoteAddFunc(share.id);
      });
    });

    document
      .getElementById('Add-from-Details')
      .addEventListener('click', () => {
        // share.shareThis.parentNode.removeChild(share.shareThis);
        const li = share.shareThis.parentElement;
        const ul = li.parentElement;
        ul.removeChild(li);
        mynoteAddFunc(share.id);
      });

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
      // ボタンに既存のクリックイベントを解除
      $('#share-list-delete').off('click');
      // ボタンに新しいクリックイベントを登録
      $('#share-list-delete').on('click', async function (e) {
        // //対象のシェアノウハウを削除
        // document.getElementById('popup-overlay_share-delete').style.display =
        //   'block';
        // document.getElementById('share-delete-name').innerHTML =
        //   share.shareTitle;
        // // 「はい」ボタンのクリックイベントを定義
        // function onDeleteClick() {
        //   // share.shareThis.parentNode.removeChild(share.shareThis);
        //   const li = share.shareThis.parentElement;
        //   const ul = li.parentElement;
        //   ul.removeChild(li);
        //   myShareNoteDelete(share.id);
        //   // イベントリスナーを削除
        //   document
        //     .getElementById('yes-button-share-delete')
        //     .removeEventListener('click', onDeleteClick);
        // }
        // document
        //   .getElementById('pop-delete_share-delete')
        //   .addEventListener('click', (e) => {
        //     e.preventDefault(); // リンクのデフォルトの動作を無効化
        //     document.getElementById(
        //       'popup-overlay_share-delete'
        //     ).style.display = 'none';
        //     document
        //       .getElementById('yes-button-share-delete')
        //       .removeEventListener('click', onDeleteClick);
        //   });
        // document
        //   .getElementById('no-button-share-delete')
        //   .addEventListener('click', (e) => {
        //     e.preventDefault(); // リンクのデフォルトの動作を無効化
        //     document.getElementById(
        //       'popup-overlay_share-delete'
        //     ).style.display = 'none';
        //     document
        //       .getElementById('yes-button-share-delete')
        //       .removeEventListener('click', onDeleteClick);
        //   });
        // document
        //   .getElementById('yes-button-share-delete')
        //   .addEventListener('click', onDeleteClick);
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

//DBのit_memo内のシェアノウハウ削除
// const myShareNoteDelete = (id) => {
//   console.log('idは ' + id);
//   $.ajax({
//     url: '/sharePostController/',
//     type: 'POST',
//     dataType: 'Json',
//     contentType: 'application/json',
//     data: JSON.stringify({
//       flg: 'share-delete',
//       id,
//     }),
//     success: function (res) {
//       document.getElementById('popup-overlay_share-delete').style.display =
//         'none';
//       resultPopUp('共有ノウハウ削除', '削除しました');
//     },
//   });
// };
