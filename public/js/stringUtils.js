//同じクラス(group)から対象の要素の順番を返す
export const orderGet = (group, target) => {
  let elements = document.getElementsByClassName(group);
  let element = document.getElementById(target);
  let index = [].slice.call(elements).indexOf(element);
  return index + 1;
};

//複数のclassを持つelementで、parentの付いたclass名を取得する関数
//classを複数持つ要素はclassを
export const classNameGet = (element) => {
  const classList = element.classList;
  for (let i = 0; i < classList.length; i++) {
    if (classList[i].toString().indexOf('parent') !== -1) {
      const className = classList[i];
      return className;
    }
  }
};

//現在日時取得＆DB格納
export const currentTimeGet = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

//タブクリック時にrootからパスを取得して返す
export const passGet = (id, title) => {
  let pass = document.getElementById(`file${id}`);
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
  if (!answer) return title;
  return answer + ' > ' + title;
};

//elemの配下の全てのファイルIDを再起的に取得し、fileIDsに格納し返す
export const fileIDUnderTheFolder = (elem) => {
  const fileIDs = [];
  // elementの子要素を全て取得
  const children = elem.children;

  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.tagName === 'SPAN' && child.classList.contains('list_title')) {
        const str = child.id;
        const ret = str.replace(/[^0-9]/g, '');
        fileIDs.push(parseInt(ret));
      }
      const foundfileIDs = fileIDUnderTheFolder(child);
      fileIDs.push(...foundfileIDs);
    }
  }
  return fileIDs;
};

//「削除しました」「共有しました」等のポップアップを1.5秒間出力する。タイトル内容指定。
export const resultPopUp = (headerStr, bodyStr) => {
  document.getElementById('popup-overlay_result-pop').style.display = 'block';
  document.getElementById('result-pop-header-h2').innerHTML = headerStr;
  document.getElementById('result-pop-body-p').innerHTML = bodyStr;
  setTimeout(() => {
    document.getElementById('popup-overlay_result-pop').style.display = 'none';
  }, 1500);
};

export const answerPopUp = (headerStr, bodyStr) => {
  document.getElementById('popup-overlay_result-pop').style.display = 'block';
  document.getElementById('result-pop-header-h2').innerHTML = headerStr;
  document.getElementById('result-pop-body-p').innerHTML = bodyStr;
  setTimeout(() => {
    document.getElementById('popup-overlay_result-pop').style.display = 'none';
  }, 1500);
};

//Emailバリデーション関数(GmailとYahoo!メールのみ)
export const validateEmail = (email) => {
  // メールアドレスの正規表現
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // メールアドレスのフォーマットをチェック
  if (!emailRegex.test(email)) {
    return false;
  }
  // ドメインのチェック
  const allowedDomains = ['gmail.com', 'yahoo.co.jp'];
  const domain = email.split('@')[1];
  if (!allowedDomains.includes(domain)) {
    return false;
  }
  return true;
}
