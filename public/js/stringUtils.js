//同じクラス(group)から対象の要素の順番を返す
export const orderGet = (group, target) => {
  let elements = document.getElementsByClassName(group);
  let element = document.getElementById(target);
  let index = [].slice.call(elements).indexOf(element);
  return index + 1;
};
