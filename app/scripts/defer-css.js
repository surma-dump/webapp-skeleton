export default () => {
  var links = document.querySelectorAll('link[rel=stylesheet-defer]');
  [].forEach.call(links, link => {
    const parent = link.parentNode;
    parent.removeChild(link);
    link.rel = 'stylesheet';
    parent.appendChild(link);
  });
};
