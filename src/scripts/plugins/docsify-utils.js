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

export {
  parseHTML,
  loadJSON,
};
