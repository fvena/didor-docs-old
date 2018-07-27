const parseHTML = (string) => string.replace(/\n/g, '')
  .replace(/[\t ]+</g, '<')
  .replace(/>[\t ]+</g, '><')
  .replace(/>[\t ]+$/g, '>');


const temp = () => 'temp';

export {
  parseHTML,
  temp,
};
