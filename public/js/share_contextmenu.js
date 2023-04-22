export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu', (e) => {
    console.log('シェア右クリック');
    console.log(`"${$(this).html()}" を右クリックしました`);
    let share = {
      shareTitle: $(this).html(),
      shareThis: this,
    };
  });
};
