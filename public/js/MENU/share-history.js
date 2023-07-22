//MENUの共有履歴の実装

let isDateSorted = false;
let isUserSorted = false;
let ascSortOrder = true; // 初期値は昇順

//共有履歴の日付を降順/昇順にする
export const sortTableByDate = () => {
  const table = document.getElementById('share-history-table');
  const rows = Array.from(table.getElementsByTagName('tr')).slice(1);

  rows.sort(function (a, b) {
    const dateA = new Date(getFormattedDate(a.cells[1].textContent));
    const dateB = new Date(getFormattedDate(b.cells[1].textContent));

    if (isDateSorted) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  isDateSorted = !isDateSorted;

  rows.forEach(function (row) {
    table.appendChild(row);
  });

  // ソートアイコンの表示切り替え
  ascSortOrder = !ascSortOrder; // 昇順と降順を切り替え
  if (ascSortOrder) {
    document.getElementById('dateSortIndicator').textContent = '▲'; // 昇順アイコン
  } else {
    document.getElementById('dateSortIndicator').textContent = '▼'; // 降順アイコン
  }
};

//共有履歴のユーザーを降順/昇順にする
export const sortTableByUser = () => {
  const table = document.getElementById('share-history-table');
  const rows = Array.from(table.getElementsByTagName('tr')).slice(1);

  rows.sort(function (a, b) {
    const userA = a.cells[2].textContent.toLowerCase();
    const userB = b.cells[2].textContent.toLowerCase();

    if (isUserSorted) {
      return userA.localeCompare(userB);
    } else {
      return userB.localeCompare(userA);
    }
  });

  isUserSorted = !isUserSorted;

  rows.forEach(function (row) {
    table.appendChild(row);
  });
  // ソートアイコンの表示切り替え
  ascSortOrder = !ascSortOrder; // 昇順と降順を切り替え
  if (ascSortOrder) {
    document.getElementById('userSortIndicator').textContent = '▲'; // 昇順アイコン
  } else {
    document.getElementById('userSortIndicator').textContent = '▼'; // 降順アイコン
  }
};

function getFormattedDate(dateString) {
  const [year, month, day, hour, minute] = dateString.split(/[-年月日:]/);
  return `${month}/${day}/${year} ${hour}:${minute}`;
}
