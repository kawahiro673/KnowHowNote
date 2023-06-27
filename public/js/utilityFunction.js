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

//ファイルまたはフォルダの囲いのサイズを再計測
export const nameChangeStringChange = (target, id) => {
  //ファイルの名前に沿ったwidthを確保
  const spanElement = document.getElementById(target + id);
  // テキストを一時的に非表示にし、要素を描画して幅を取得
  spanElement.style.visibility = 'hidden';
  spanElement.style.display = 'inline-block';
  const textWidth = spanElement.getBoundingClientRect().width;
  spanElement.style.visibility = '';
  spanElement.style.display = '';
  spanElement.style.width = textWidth + 5 + 'px'; // 幅を設定
};

//指定したバイト数以上の文字列を省略
export const truncateStringByByte = (str, byteLength) => {
  let truncated = str.slice(0, byteLength);
  if (truncated.charCodeAt(truncated.length - 1) > 255) {
    truncated = truncated.slice(0, truncated.length - 1);
  }
  return truncated + '...';
};
