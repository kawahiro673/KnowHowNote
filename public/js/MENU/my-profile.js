//MENUの個人設定の実装

export const backgroundColorSet = (color) => {
  document
    .querySelector('.container')
    .classList.add(`backgroundColor-${color}`);
  document.querySelector('header').classList.add(`headerColor-${color}`);
  document.querySelector('section').classList.add(`section-${color}`);
  document.querySelector('.dropLabel').classList.add(`dropLabel-${color}`);
  document.querySelector('.tab-wrap').classList.add(`tab-wrap-${color}`);
  document.querySelector('.dropInput').classList.add(`dropInput-${color}`);

  document.querySelector('.cube1').classList.add(`cube1-${color}`);
  document.querySelector('.cube2').classList.add(`cube2-${color}`);
  document.querySelector('.cube3').classList.add(`cube3-${color}`);
  document.querySelector('.cube4').classList.add(`cube4-${color}`);
  document.querySelector('.cube5').classList.add(`cube5-${color}`);
  document.querySelector('.cube6').classList.add(`cube6-${color}`);

  const files = document.querySelectorAll('.file');
  if (files !== null) {
    files.forEach((file) => {
      file.classList.add(`file-${color}`);
    });
  }
  const folders = document.querySelectorAll('.folder');
  if (folders !== null) {
    folders.forEach((folder) => {
      folder.classList.add(`folder-${color}`);
    });
  }
  const icons = document.querySelectorAll('i');
  icons.forEach((icon) => {
    icon.classList.add(`i-${color}`);
  });
};

export const backgroundColorDelete = () => {
  const container = document.querySelector('.container');
  container.classList.remove('backgroundColor-red');
  container.classList.remove('backgroundColor-yellow');
  container.classList.remove('backgroundColor-blue');
  container.classList.remove('backgroundColor-green');
  container.classList.remove('backgroundColor-purple');
  container.classList.remove('backgroundColor-orange');
  container.classList.remove('backgroundColor-gray');

  const header = document.querySelector('header');
  header.classList.remove('headerColor-red');
  header.classList.remove('headerColor-yellow');
  header.classList.remove('headerColor-blue');
  header.classList.remove('headerColor-green');
  header.classList.remove('headerColor-purple');
  header.classList.remove('headerColor-orange');
  header.classList.remove('headerColor-gray');

  const section = document.querySelector('section');
  section.classList.remove('section-red');
  section.classList.remove('section-yellow');
  section.classList.remove('section-blue');
  section.classList.remove('section-green');
  section.classList.remove('section-purple');
  section.classList.remove('section-orange');
  section.classList.remove('section-gray');

  const dropLabel = document.querySelector('.dropLabel');
  dropLabel.classList.remove('dropLabel-red');
  dropLabel.classList.remove('dropLabel-yellow');
  dropLabel.classList.remove('dropLabel-blue');
  dropLabel.classList.remove('dropLabel-green');
  dropLabel.classList.remove('dropLabel-purple');
  dropLabel.classList.remove('dropLabel-orange');
  dropLabel.classList.remove('dropLabel-gray');

  const tabWrap = document.querySelector('.tab-wrap');
  tabWrap.classList.remove('tab-wrap-red');
  tabWrap.classList.remove('tab-wrap-yellow');
  tabWrap.classList.remove('tab-wrap-blue');
  tabWrap.classList.remove('tab-wrap-green');
  tabWrap.classList.remove('tab-wrap-purple');
  tabWrap.classList.remove('tab-wrap-orange');
  tabWrap.classList.remove('tab-wrap-gray');

  const dropInput = document.querySelector('.dropInput');
  dropInput.classList.remove('dropInput-red');
  dropInput.classList.remove('dropInput-yellow');
  dropInput.classList.remove('dropInput-blue');
  dropInput.classList.remove('dropInput-green');
  dropInput.classList.remove('dropInput-purple');
  dropInput.classList.remove('dropInput-orange');
  dropInput.classList.remove('dropInput-gray');

  const files = document.querySelectorAll('.file');
  if (files !== null) {
    files.forEach((file) => {
      file.classList.remove('file-red');
      file.classList.remove('file-yellow');
      file.classList.remove('file-blue');
      file.classList.remove('file-green');
      file.classList.remove('file-purple');
      file.classList.remove('file-orange');
      file.classList.remove('file-gray');
    });
  }

  const folders = document.querySelectorAll('.folder');
  if (folders !== null) {
    folders.forEach((folder) => {
      folder.classList.remove('folder-red');
      folder.classList.remove('folder-yellow');
      folder.classList.remove('folder-blue');
      folder.classList.remove('folder-green');
      folder.classList.remove('folder-purple');
      folder.classList.remove('folder-orange');
      folder.classList.remove('folder-gray');
    });
  }

  const cube1 = document.querySelector('.cube1');
  cube1.classList.remove(`cube1-red`);
  cube1.classList.remove(`cube1-yellow`);
  cube1.classList.remove(`cube1-blue`);
  cube1.classList.remove(`cube1-green`);
  cube1.classList.remove(`cube1-purple`);
  cube1.classList.remove(`cube1-orange`);
  cube1.classList.remove(`cube1-gray`);

  const cube2 = document.querySelector('.cube2');
  cube2.classList.remove(`cube2-red`);
  cube2.classList.remove(`cube2-yellow`);
  cube2.classList.remove(`cube2-blue`);
  cube2.classList.remove(`cube2-green`);
  cube2.classList.remove(`cube2-purple`);
  cube2.classList.remove(`cube2-orange`);
  cube2.classList.remove(`cube2-gray`);

  const cube3 = document.querySelector('.cube3');
  cube3.classList.remove(`cube3-red`);
  cube3.classList.remove(`cube3-yellow`);
  cube3.classList.remove(`cube3-blue`);
  cube3.classList.remove(`cube3-green`);
  cube3.classList.remove(`cube3-purple`);
  cube3.classList.remove(`cube3-orange`);
  cube3.classList.remove(`cube3-gray`);

  const cube4 = document.querySelector('.cube4');
  cube4.classList.remove(`cube4-red`);
  cube4.classList.remove(`cube4-yellow`);
  cube4.classList.remove(`cube4-blue`);
  cube4.classList.remove(`cube4-green`);
  cube4.classList.remove(`cube4-purple`);
  cube4.classList.remove(`cube4-orange`);
  cube4.classList.remove(`cube4-gray`);

  const cube5 = document.querySelector('.cube5');
  cube5.classList.remove(`cube5-red`);
  cube5.classList.remove(`cube5-yellow`);
  cube5.classList.remove(`cube5-blue`);
  cube5.classList.remove(`cube5-green`);
  cube5.classList.remove(`cube5-purple`);
  cube5.classList.remove(`cube5-orange`);
  cube5.classList.remove(`cube5-gray`);

  const cube6 = document.querySelector('.cube6');
  cube6.classList.remove(`cube6-red`);
  cube6.classList.remove(`cube6-yellow`);
  cube6.classList.remove(`cube6-blue`);
  cube6.classList.remove(`cube6-green`);
  cube6.classList.remove(`cube6-purple`);
  cube6.classList.remove(`cube6-orange`);
  cube6.classList.remove(`cube6-gray`);

  const icons = document.querySelectorAll('i');
  icons.forEach((icon) => {
    icon.classList.remove('i-red');
    icon.classList.remove('i-yellow');
    icon.classList.remove('i-blue');
    icon.classList.remove('i-green');
    icon.classList.remove('i-purple');
    icon.classList.remove('i-orange');
    icon.classList.remove('i-gray');
  });
};

const backgroundColorPreservation = (color) => {
  $.ajax({
    url: '/mypage/' + hashedIdGet,
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'backgroundColor',
      color,
    }),
    success: function (res) {
      backgroundColorDelete();

      if (color === 'red') {
        backgroundColorSet('red');
      } else if (color === 'blue') {
        backgroundColorSet('blue');
      } else if (color === 'yellow') {
        backgroundColorSet('yellow');
      } else if (color === 'green') {
        backgroundColorSet('green');
      } else if (color === 'purple') {
        backgroundColorSet('purple');
      } else if (color === 'orange') {
        backgroundColorSet('orange');
      } else if (color === 'gray') {
        backgroundColorSet('gray');
      }
    },
  });
};
export const backgroundColorCheckBoxOption = () => {
  const checkboxes = document.querySelectorAll('.checkbox-color');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      if (checkbox.checked) {
        const label = checkbox.parentElement; // 親要素の<label>を取得
        const text = label.textContent.trim(); // ラベル要素のテキストを取得し、前後の空白をトリム

        // チェックされているチェックボックスのテキストを使って適切な処理を行う
        switch (text) {
          case '赤':
            backgroundColorPreservation('red');
            break;
          case '青':
            backgroundColorPreservation('blue');
            break;
          case '黄':
            backgroundColorPreservation('yellow');
            break;
          case '緑':
            backgroundColorPreservation('green');
            break;
          case '紫':
            backgroundColorPreservation('purple');
            break;
          case '橙':
            backgroundColorPreservation('orange');
            break;
          case '灰色':
            backgroundColorPreservation('gray');
            break;
          default:
            // チェックされているテキストが上記以外の場合の処理
            break;
        }
      } else {
        checkbox.checked = true; // チェックが外れた場合に再度チェックを付ける
      }
    });
  });
};
