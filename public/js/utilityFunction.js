//elemの全ての配下要素を再起的に参照。inputタブが配下にあればtrue,なければfalse
export const hasInput = (elem) => {
  if (elem.tagName === 'INPUT') {
    return true;
  } else if (elem.children.length > 0) {
    for (let i = 0; i < elem.children.length; i++) {
      if (hasInput(elem.children[i])) {
        return true;
      }
    }
  }
  return false;
};

//シェアタブを開いている時にボタンを無効化する
export const disableElements = () => {
  document.getElementById('createbutton').setAttribute('disabled', 'disabled');
  document
    .getElementById('createfilebutton')
    .setAttribute('disabled', 'disabled');
};

// 要素を有効化する関数
export const enableElements = () => {
  document.getElementById('createbutton').removeAttribute('disabled');
  document.getElementById('createfilebutton').removeAttribute('disabled');
};

// share-tab要素をクリックした際の処理
document.getElementById('share-tab').addEventListener('click', () => {
  disableElements();
});

// nouhau要素をクリックした際の処理
document.getElementById('nouhau').addEventListener('click', () => {
  enableElements();
});

// export const allowDragAndDropOfFiles = () => {
//   $('.file').on('mousedown', function (e) {
//     const $clone = $(this).clone();
//     $clone.css('position', 'absolute');
//     $clone.css('background-color', 'white');
//     // ゴーストエフェクト要素をbodyに追加
//     $('body').append($clone);

//     // ドラッグ中の動作を設定
//     $(document).on('mousemove', function (e) {
//       // ゴーストエフェクトをドラッグに追従させる
//       $clone.css('left', e.pageX + 'px');
//       $clone.css('top', e.pageY + 'px');
//     });

//     // ドラッグ終了時の処理を設定
//     $(document).on('mouseup', function (e) {
//       // ゴーストエフェクト要素を削除
//       $clone.remove();

//       // 不要なイベントハンドラを解除
//       $(document).off('mousemove');
//       $(document).off('mouseup');
//     });
//   });
// };

// export const allowDragAndDropOfFolders = () => {
//   $('.folder').on('mousedown', function (e) {
//     const $clone = $(this).clone();
//     $clone.css('position', 'absolute');
//     $clone.css('background-color', 'white');
//     // ゴーストエフェクト要素をbodyに追加
//     $('body').append($clone);

//     // ドラッグ中の動作を設定
//     $(document).on('mousemove', function (e) {
//       // ゴーストエフェクトをドラッグに追従させる
//       $clone.css('left', e.pageX + 'px');
//       $clone.css('top', e.pageY + 'px');
//     });

//     // ドラッグ終了時の処理を設定
//     $(document).on('mouseup', function (e) {
//       // ゴーストエフェクト要素を削除
//       $clone.remove();

//       // 不要なイベントハンドラを解除
//       $(document).off('mousemove');
//       $(document).off('mouseup');
//     });
//   });
// };

export const allowDragAndDropOfFiles = () => {
  $('.file').on('mousedown', function (e) {
    const $clone = $(this).clone();
    $clone.css('position', 'absolute');
    $clone.css('background-color', 'white');
    // ゴーストエフェクト要素をbodyに追加
    $('body').append($clone);

    // ドラッグ中の動作を設定
    $(document).on('mousemove.fileDrag', function (e) {
      // ゴーストエフェクトをドラッグに追従させる
      $clone.css('left', e.pageX + 'px');
      $clone.css('top', e.pageY + 'px');
    });

    // ドラッグ終了時の処理を設定
    $(document).on('mouseup.fileDrag', function (e) {
      // ゴーストエフェクト要素を削除
      $clone.remove();

      // イベントハンドラを解除
      $(document).off('mousemove.fileDrag');
      $(document).off('mouseup.fileDrag');
    });
  });
};

export const allowDragAndDropOfFolders = () => {
  $('.folder').on('mousedown', function (e) {
    const $clone = $(this).clone();
    $clone.css('position', 'absolute');
    $clone.css('background-color', 'white');
    // ゴーストエフェクト要素をbodyに追加
    $('body').append($clone);

    // ドラッグ中の動作を設定
    $(document).on('mousemove.folderDrag', function (e) {
      // ゴーストエフェクトをドラッグに追従させる
      $clone.css('left', e.pageX + 'px');
      $clone.css('top', e.pageY + 'px');
    });

    // ドラッグ終了時の処理を設定
    $(document).on('mouseup.folderDrag', function (e) {
      // ゴーストエフェクト要素を削除
      $clone.remove();

      // イベントハンドラを解除
      $(document).off('mousemove.folderDrag');
      $(document).off('mouseup.folderDrag');
    });
  });
};

//ノウハウ作成時に生成されたinput(親のli要素)が、同階層で上から何番目(order)に作成されたかを返す関数
export const getInputOrder = (inputId) => {
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    const liParentElement = inputElement.closest('li');
    if (liParentElement) {
      let order = 1;
      let currentElement = liParentElement.previousElementSibling;

      while (currentElement) {
        if (currentElement.tagName === 'LI') {
          order++;
        }
        currentElement = currentElement.previousElementSibling;
      }
      return order;
    }
  }
  return -1; // 要素が見つからなかった場合に-1を返す、エラー処理を追加
};
