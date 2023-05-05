const conme = document.getElementById('contextmenu');
const conme2 = document.getElementById('contextmenu2');
const conme3 = document.getElementById('contextmenu3');
const conme4 = document.getElementById('contextmenu4');
const conme5 = document.getElementById('contextmenu5');

export const labelContextmenu = (tabIdArray) => {
  $('.tab-label').on('contextmenu', function (e) {
    conme5.style.left = e.pageX + 'px';
    conme5.style.top = e.pageY + 'px';
    conme5.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';

    const idValue = this.id;
    let label = {
      title: $(this).html(),
      id: idValue.replace(/[^0-9]/g, ''),
      elem: this,
    };

    document.getElementById('pink').addEventListener('click', () => {
      tabLabelsColor(label.id, '#FF00FF');
    });
    document.getElementById('red').addEventListener('click', () => {
      tabLabelsColor(label.id, '#FF0000');
    });
    document.getElementById('orange').addEventListener('click', () => {
      tabLabelsColor(label.id, '#FFA500');
    });
    document.getElementById('yellow').addEventListener('click', () => {
      tabLabelsColor(label.id, '#FFFF00');
    });
    document.getElementById('yellow-green').addEventListener('click', () => {
      tabLabelsColor(label.id, '#98FB98');
    });
    document.getElementById('green').addEventListener('click', () => {
      tabLabelsColor(label.id, '#66CDAA');
    });
    document.getElementById('sky-blue').addEventListener('click', () => {
      tabLabelsColor(label.id, '#AFEEEE');
    });
    document.getElementById('blue').addEventListener('click', () => {
      tabLabelsColor(label.id, '#0000FF');
    });
    document.getElementById('purple').addEventListener('click', () => {
      tabLabelsColor(label.id, '#800080');
    });
    document.getElementById('brown').addEventListener('click', () => {
      tabLabelsColor(label.id, '#B8860B');
    });
    document.getElementById('gray').addEventListener('click', () => {
      tabLabelsColor(label.id, '#A9A9A9');
    });
    document.getElementById('black').addEventListener('click', () => {
      tabLabelsColor(label.id, '#000000');
    });
  });
};

const tabLabelsColor = (id, color) => {
  const label = document.getElementById(`tab-ID${id}`);
  // // 各.tab-labelにランダムな色を割り当てる
  label.style.setProperty('--tab-label-background-color', color);
};
