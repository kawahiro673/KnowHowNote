export const labelContextmenu = (tabIdArray) => {
  $('.tab-label').on('contextmenu', function () {
    console.log(this);
    console.log(this.id);
    // const regex = /(\d+)/;
    // const idNum = tabId.match(regex)[0];
    let label = {
      title: $(this).html(),
      id: $(this).attr('id'),
      elem: this,
    };
  });
};
