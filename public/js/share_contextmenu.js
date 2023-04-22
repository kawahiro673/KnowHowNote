export const shareContextmenu = () => {
  document.getElementById('share_list').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('シェア右クリック');
  });
};
