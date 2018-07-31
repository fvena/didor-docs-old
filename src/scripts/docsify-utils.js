const parseHTML = (string) => string.replace(/\n/g, '')
  .replace(/[\t ]+</g, '<')
  .replace(/>[\t ]+</g, '><')
  .replace(/>[\t ]+$/g, '>');


const loadJSON = (file) => new Promise((resolve) => {
  const xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', file, true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState === 4 && xobj.status === 200) {
      resolve(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);
});


const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


export {
  parseHTML,
  loadJSON,
  copyToClipboard,
};
