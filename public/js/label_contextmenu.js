export const labelContextmenu = (tabIdArray) => {
  $('.tab-label').on('contextmenu', function () {
    console.log(this);
    console.log(this.id);
    const idValue = this.id;
    const id = idValue.replace(/[^0-9]/g, '');
    let label = {
      title: $(this).html(),
      id,
      elem: this,
    };
    console.log(label.id);
  });
};
