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


let isDragging = false;
let offsetX, offsetY;

export const allowDragAndDropOfFiles = () => {
  $('.file').on('mousedown', function (e) {
    isDragging = true;
    const $target = $(this);
    // ドラッグ開始時のマウスカーソルと要素の相対的な位置を計算
    offsetX = e.pageX - $target.offset().left;
    offsetY = e.pageY - $target.offset().top;

    $(document).on('mousemove', function (e) {
      if (isDragging) {
        // ドラッグ中の要素を移動
        $target.css('left', e.pageX - offsetX + 'px');
        $target.css('top', e.pageY - offsetY + 'px');
      }
    });

    $(document).on('mouseup', function () {
      isDragging = false;
      // 不要なイベントハンドラを解除
      $(document).off('mousemove');
      $(document).off('mouseup');
    });
  });
};

export const allowDragAndDropOfFolders = () => {
  $('.folder').on('mousedown', function (e) {
    isDragging = true;
    const $target = $(this);
    // ドラッグ開始時のマウスカーソルと要素の相対的な位置を計算
    offsetX = e.pageX - $target.offset().left;
    offsetY = e.pageY - $target.offset().top;

    $(document).on('mousemove', function (e) {
      if (isDragging) {
        // ドラッグ中の要素を移動
        $target.css('left', e.pageX - offsetX + 'px');
        $target.css('top', e.pageY - offsetY + 'px');
      }
    });

    $(document).on('mouseup', function () {
      isDragging = false;
      // 不要なイベントハンドラを解除
      $(document).off('mousemove');
      $(document).off('mouseup');
    });
  });
};
