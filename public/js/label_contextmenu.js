export const labelContextmenu = () => {
  $('.tab-label').on('contextmenu', function (e) {
    const idValue = this.id;
    let label = {
      title: $(this).html(),
      id: idValue.replace(/[^0-9]/g, ''),
      elem: this,
    };

    $(document).ready(function () {
      $('#pink').off('click');
      $('#pink').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#FF00FF');
      });
    });
    $(document).ready(function () {
      $('#red').off('click');
      $('#red').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#FF0000');
      });
    });
    $(document).ready(function () {
      $('#orange').off('click');
      $('#orange').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#FFA500');
      });
    });
    $(document).ready(function () {
      $('#yellow').off('click');
      $('#yellow').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#FFFF00');
      });
    });
    $(document).ready(function () {
      $('#yellow-green').off('click');
      $('#yellow-green').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#98FB98');
      });
    });
    $(document).ready(function () {
      $('#green').off('click');
      $('#green').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#228B22');
      });
    });
    $(document).ready(function () {
      $('#sky-blue').off('click');
      $('#sky-blue').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#AFEEEE');
      });
    });
    $(document).ready(function () {
      $('#blue').off('click');
      $('#blue').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#0000FF');
      });
    });
    $(document).ready(function () {
      $('#purple').off('click');
      $('#purple').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#800080');
      });
    });
    $(document).ready(function () {
      $('#brown').off('click');
      $('#brown').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#B8860B');
      });
    });
    $(document).ready(function () {
      $('#gray').off('click');
      $('#gray').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#A9A9A9');
      });
    });
    $(document).ready(function () {
      $('#black').off('click');
      $('#black').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#000000');
      });
    });
    $(document).ready(function () {
      $('#white').off('click');
      $('#white').on('click', function (event) {
        tabLabelColorUpdate(label.id, '#FFFFFF');
      });
    });
  });
};

const tabLabelColorUpdate = (id, color) => {
  const label = document.getElementById(`tab-ID${id}`);
  // 各.tab-labelにランダムな色を割り当てる
  label.style.setProperty('--tab-label-background-color', color);
  $.ajax({
    url: '/tabPostController/',
    type: 'POST',
    dataType: 'Json',
    contentType: 'application/json',
    data: JSON.stringify({
      flg: 'labelColorUpdate',
      id,
      color,
    }),
    success: function (res) {},
  });
};
