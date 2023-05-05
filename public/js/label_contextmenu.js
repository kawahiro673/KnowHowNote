const conme = document.getElementById('contextmenu');
const conme2 = document.getElementById('contextmenu2');
const conme3 = document.getElementById('contextmenu3');
const conme4 = document.getElementById('contextmenu4');
const conme5 = document.getElementById('contextmenu5');

export const labelContextmenu = (tabIdArray) => {
  $('.tab-label').on('contextmenu', function () {
    conme5.style.left = e.pageX + 'px';
    conme5.style.top = e.pageY + 'px';
    conme5.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';

    const idValue = this.id;
    const id = idValue.replace(/[^0-9]/g, '');
    let label = {
      title: $(this).html(),
      id,
      elem: this,
    };
  });
};
