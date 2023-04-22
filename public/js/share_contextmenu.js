export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu', (e) => {
    console.log('シェア右クリック');
    console.log(this);
  });
};
