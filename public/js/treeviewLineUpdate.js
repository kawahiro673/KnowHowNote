//ドラッグアンドドロップ後parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
//①関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下にある時に、要素のクラスにlastを追加し、要素A以外の同階層の兄弟要素に
// 「last」または「lastCollapsable」または「lastExpandable」というクラスがあれば、そのクラスを削除
//②関数が受け取った引数(要素A)が同階層の兄弟要素の中で一番下でない場合、その要素の クラスに「last」があれば「last」を削除し、同階層の兄弟要素の一番下の要素に「last」を追加する。
// ただし、その同階層の兄弟要素の一番下の要素のクラスに、「collapsable」または「expandable」があれば追加し、この場合、「last」は追加しない
export const updateLastClasses_file = (element) => {
  const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  for (const sibling of siblings) {
    if (sibling !== element) {
      if (
        sibling.classList.contains('last') ||
        sibling.classList.contains('lastCollapsable') ||
        sibling.classList.contains('lastExpandable')
      ) {
        sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
      }
    }
  }

  if (lastSibling === element) {
    element.classList.remove('last', 'lastCollapsable', 'lastExpandable');
    if (element.classList.contains('collapsable')) {
      element.classList.add('lastCollapsable');
    } else if (element.classList.contains('expandable')) {
      element.classList.add('lastExpandable');
    } else {
      element.classList.add('last');
    }
  } else {
    element.classList.remove('last');
    if (lastSibling) {
      lastSibling.classList.add('last');
      if (lastSibling.classList.contains('collapsable')) {
        lastSibling.classList.add('lastCollapsable');
        lastSibling.classList.remove('lastExpandable');
      } else if (lastSibling.classList.contains('expandable')) {
        lastSibling.classList.add('lastExpandable');
        lastSibling.classList.remove('lastCollapsable');
      } else {
        lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
      }
    }
  }
};

//ドラッグアンドドロップ後parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
//①関数が受け取った引数(要素)が同階層の兄弟要素の中で一番下にある時に、要素のクラスに「collapsable」がある場合は、「lastCollapsable」を追加し、「expandable」がある場合は、「lastExpandable」を追加
//  そして要素A以外の同階層の兄弟要素に「last」または「lastCollapsable」または「lastExpandable」というクラスがあれば、そのクラスを削除
//②関数が受け取った引数(要素A)が同階層の兄弟要素の中で一番下でない場合、その要素のクラスに「lastCollapsable」や「lastExpandable」があれば削除し、
// 同階層の兄弟要素の一番下の要素に「last」を追加する。ただし、その同階層の一番下の要素のクラスに「collapsable」または「expandable」があれば追加し、この場合「last」は追加しない
export const updateLastClasses_Folder = (element) => {
  const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  for (const sibling of siblings) {
    if (sibling !== element) {
      if (
        sibling.classList.contains('last') ||
        sibling.classList.contains('lastCollapsable') ||
        sibling.classList.contains('lastExpandable')
      ) {
        sibling.classList.remove('last', 'lastCollapsable', 'lastExpandable');
      }
    }
  }

  if (lastSibling === element) {
    element.classList.remove('last', 'lastCollapsable', 'lastExpandable');
    if (element.classList.contains('collapsable')) {
      element.classList.add('lastCollapsable');
    } else if (element.classList.contains('expandable')) {
      element.classList.add('lastExpandable');
    } else {
      element.classList.add('last');
    }
  } else {
    element.classList.remove('lastCollapsable', 'lastExpandable');
    if (lastSibling) {
      if (lastSibling.classList.contains('collapsable')) {
        lastSibling.classList.remove('last');
        lastSibling.classList.add('lastCollapsable');
      } else if (lastSibling.classList.contains('expandable')) {
        lastSibling.classList.remove('last');
        lastSibling.classList.add('lastExpandable');
      } else {
        lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
        lastSibling.classList.add('last');
      }
    }
  }
};

//ドラッグアンドドロップ前parent要素配下内のUI補正。sortableのD&DによるLineの崩れ補正。
export const addLastClassToLastSibling = (element) => {
  const siblings = element.parentNode.children;
  const lastSibling = siblings[siblings.length - 1];

  if (lastSibling) {
    if (lastSibling.classList.contains('collapsable')) {
      lastSibling.classList.add('lastCollapsable');
      //lastSibling.classList.remove('lastExpandable');
    } else if (lastSibling.classList.contains('expandable')) {
      lastSibling.classList.add('lastExpandable');
      //lastSibling.classList.remove('lastCollapsable');
    } else {
      lastSibling.classList.add('last');
      //lastSibling.classList.remove('lastCollapsable', 'lastExpandable');
    }
  }
};

//関数が受け取った引数(要素)と同じ、同階層の兄弟要素の中で、クラス名「lastCollapsable-hitarea」と「lastExpandable-hitarea」クラスを削除
//上記のクラスがあることによって、D&D時に、「⊕」「⊖」が消えてしまう事がある
export const removeLastHitareaClasses = (element) => {
  const siblings = element.parentNode.children;

  for (const sibling of siblings) {
    if (sibling !== element) {
      const hitarea = sibling.querySelector(
        '.lastCollapsable-hitarea, .lastExpandable-hitarea'
      );
      if (hitarea) {
        hitarea.classList.remove(
          'lastCollapsable-hitarea',
          'lastExpandable-hitarea'
        );
      }
    }
  }
};

//自分自身の要素のクラス名「lastCollapsable-hitarea」と「lastExpandable-hitarea」クラスを削除
export const removeLastHitareaClasses_this = (element) => {
  const hitareas = element.querySelectorAll(
    '.lastCollapsable-hitarea, .lastExpandable-hitarea'
  );

  for (const hitarea of hitareas) {
    hitarea.classList.remove(
      'lastCollapsable-hitarea',
      'lastExpandable-hitarea'
    );
  }
};
