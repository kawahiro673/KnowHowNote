export const shareContextmenu = () => {
  $('.sharenote').on('contextmenu', () => {
    e.preventDefault();
    console.log('シェア右クリック');
  });
};
