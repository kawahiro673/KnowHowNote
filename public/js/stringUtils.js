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

//「はい」「いいえ」ポップアップ
export const answerPopUp = (title, content) => {
  document.getElementById('popup-overlay_answer-pop').style.display = 'block';
  document.getElementById('answer-pop-h2').innerHTML = title;
  document.getElementById('answer-pop-p').innerHTML = content;

  // document
  //   .getElementById('pop-delete_answer-pop')
  //   .addEventListener('click', (e) => {
  //     e.preventDefault(); // リンクのデフォルトの動作を無効化
  //     document.getElementById('popup-overlay_answer-pop').style.display =
  //       'none';
  //   });

  // document
  //   .getElementById('popup-overlay_answer-pop')
  //   .addEventListener('click', (e) => {
  //     const popup = document.getElementById('popup-overlay_answer-pop');
  //     if (e.target === popup) {
  //       popup.style.display = 'none';
  //     }
  //   });

  // return new Promise((resolve) => {
  //   // 「いいえ」が押されたことを解決する値としてtrue返す
  //   document
  //     .getElementById('yes-button-answer-pop')
  //     .addEventListener('click', function () {
  //       document.getElementById('popup-overlay_answer-pop').style.display =
  //         'none';
  //       resolve(true); // 「はい」が押されたことを解決する値として返す
  //     });

  //   // 「いいえ」が押されたことを解決する値としてfalse返す
  //   document
  //     .getElementById('no-button-answer-pop')
  //     .addEventListener('click', function () {
  //       document.getElementById('popup-overlay_answer-pop').style.display =
  //         'none';
  //       resolve(false);
  //     });
  // });

   return new Promise((resolve) => {
    const yesButton = document.getElementById('yes-button-answer-pop');
    const noButton = document.getElementById('no-button-answer-pop');
    const deleteButton = document.getElementById('pop-delete_answer-pop');

    const yesClickHandler = function () {
      document.getElementById('popup-overlay_answer-pop').style.display = 'none';
      resolve(true);
    };

    const noClickHandler = function () {
      document.getElementById('popup-overlay_answer-pop').style.display = 'none';
      resolve(false);
    };

    // 以前のリスナーを削除
    yesButton.removeEventListener('click', yesClickHandler);
    noButton.removeEventListener('click', noClickHandler);
    deleteButton.removeEventListener('click', noClickHandler); 

    // 新しいリスナーを追加
    yesButton.addEventListener('click', yesClickHandler);
    noButton.addEventListener('click', noClickHandler);
    deleteButton.addEventListener('click', noClickHandler); 
  });
  
};

// 通常のメールアドレスバリデーション関数
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // メールアドレスのフォーマットをチェック
  if (!emailRegex.test(email)) {
    return false;
  }
  return true;
};

//「OK」押下で閉じる説明や注意点のポップアップ生成
export const explanationPopUp = (title, content) => {
  document.getElementById('popup-overlay_explanation-pop').style.display =
    'block';
  document.getElementById('explanation-pop-h2').innerHTML = title;
  document.getElementById('explanation-pop-p').innerHTML = content;

  const yesButton = document.getElementById('yes-button-explanation-pop');
  if (yesButton) {
    yesButton.focus();
  }

  document
    .getElementById('pop-delete_explanation-pop')
    .addEventListener('click', (e) => {
      e.preventDefault(); // リンクのデフォルトの動作を無効化
      document.getElementById('popup-overlay_explanation-pop').style.display =
        'none';
    });

  document
    .getElementById('yes-button-explanation-pop')
    .addEventListener('click', (e) => {
      e.preventDefault(); // リンクのデフォルトの動作を無効化
      document.getElementById('popup-overlay_explanation-pop').style.display =
        'none';
    });
};

export const validatePassword = (input) => {
  // 正規表現を使用して半角英数字の8文字以上20文字以下かを判定
  const regex = /^[a-zA-Z0-9]{8,20}$/;
  return regex.test(input);
};

// 20文字以内で、英数字のみを含むかを正規表現で判定
export const validateUsername = (username) => {
  const pattern = /^[a-zA-Z0-9]{1,20}$/;
  return pattern.test(username);
};

//ランダムな半角英数字をlengthの長さ分生成する関数
export const generateRandomString = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};
