import { parseHTML, loadJSON, copyToClipboard } from './docsify-utils';


/**
 * constants
 */
const COLORS_BLOCK = /^colors\[(.*)+?\]>$/gm;


/**
 * templates
 */
function colorsDemo(colors, family) {
  let content = '<div class="colors-demo">';

  if (family === 'brand') {
    // eslint-disable-next-line
    for (let color in colors) {
      if ({}.hasOwnProperty.call(colors, color)) {
        const value = colors[color];

        if (!color.endsWith('-dark') && !color.endsWith('-light')) {
          const dark = `${color}-dark`;
          const light = `${color}-light`;

          content += `
            <div class="colorBlock__col">
              <div class="colorBlock" style="background-color: ${colors[light]}" data-copy="brand(${light})">
                <div class="colorBlock__name">
                  ${light}
                  <div class="colorBlock__hex">${colors[light]}</div>
                </div>
              </div>
              <div class="colorBlock" style="background-color: ${value}" data-copy="brand(${color})">
                <div class="colorBlock__name">
                  ${color}
                  <div class="colorBlock__hex">${value}</div>
                </div>
              </div>
              <div class="colorBlock" style="background-color: ${colors[dark]}" data-copy="brand(${dark})">
                <div class="colorBlock__name">
                  ${dark}
                  <div class="colorBlock__hex">${colors[dark]}</div>
                </div>
              </div>
            </div>
          `;
        }
      }
    }
  } else {
    // eslint-disable-next-line
    for (var color in colors) {
      if ({}.hasOwnProperty.call(colors, color)) {
        const value = colors[color];

        content += `
          <div class="colorBlock__col">
            <div class="colorBlock" style="background-color: ${value}" data-copy="${family}(${color})">
              <div class="colorBlock__name">
                ${color}
                <div class="colorBlock__hex">${value}</div>
              </div>
            </div>
          </div>
        `;
      }
    }
  }
  content += '</div>';


  return parseHTML(content);
}


/**
 * render
 */
function renderColors(content, colors) {
  let match = COLORS_BLOCK.exec(content);

  while (match != null) {
    content = content.replace(match[0], colorsDemo(colors[match[1]], match[1]));
    match = COLORS_BLOCK.exec(content);
  }

  return content;
}


function copy(event) {
  const copyData = event.currentTarget.getAttribute('data-copy');
  copyToClipboard(copyData);
}


function addColorButtonEvent() {
  const colorButtons = document.querySelectorAll('.colorBlock');

  colorButtons.forEach((button) => {
    button.addEventListener('click', copy);
  });
}

const install = async (hook) => {
  const basePath = window.$docsify.basePath;
  const version = (window.$docsify.versions) ? `/${window.$docsify.versions[0].basePath}` : '';
  const varSass = await loadJSON(`${basePath}${version}/config/sassVar.json`);

  hook.beforeEach((content) => renderColors(content, varSass.colors));
  hook.doneEach(() => { addColorButtonEvent(); });
};

export default install;
