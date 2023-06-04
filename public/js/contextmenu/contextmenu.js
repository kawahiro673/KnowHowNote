const conme = document.getElementById('contextmenu');
const conme2 = document.getElementById('contextmenu2');
const conme3 = document.getElementById('contextmenu3');
const conme4 = document.getElementById('contextmenu4');
const conme5 = document.getElementById('contextmenu5');

$('#right').on('click contextmenu', (e) => {
  if (e.target.closest('.list_title')) {
    conme.style.left = e.clientX + 'px';
    conme.style.top = e.clientY + 'px';
    conme.style.display = 'block';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  } else if (e.target.closest('.folder')) {
    conme3.style.left = e.clientX + 'px';
    conme3.style.top = e.clientY + 'px';
    conme3.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  } else if (e.target.closest('.sharenote')) {
    conme4.style.left = e.clientX + 'px';
    conme4.style.top = e.clientY + 'px';
    conme4.style.display = 'block';
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme5.style.display = 'none';
  } else {
    conme2.style.left = e.clientX + 'px';
    conme2.style.top = e.clientY + 'px';
    conme2.style.display = 'block';
    conme.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  }
  document.body.addEventListener('click', function (e) {
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
    conme5.style.display = 'none';
  });
});

$('html').on('click contextmenu', (e) => {
  let a = $(e.target).closest('#right').length;
  if (a) {
    //rightの上
  } else {
    conme.style.display = 'none';
    conme2.style.display = 'none';
    conme3.style.display = 'none';
    conme4.style.display = 'none';
  }
});

window.addEventListener('scroll', function () {
  conme.style.display = 'none';
  conme2.style.display = 'none';
  conme3.style.display = 'none';
  conme4.style.display = 'none';
  conme5.style.display = 'none';
});
