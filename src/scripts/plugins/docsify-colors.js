import { parseHTML, loadJSON } from './docsify-utils';


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
              <div class="colorBlock" style="background-color: ${colors[light]}" onclick="copyToClipboard('brand(${light})');">
                <div class="colorBlock__name">
                  ${light}
                  <div class="colorBlock__hex">${colors[light]}</div>
                </div>
              </div>
              <div class="colorBlock" style="background-color: ${value}" onclick="copyToClipboard('brand(${color})');">
                <div class="colorBlock__name">
                  ${color}
                  <div class="colorBlock__hex">${value}</div>
                </div>
              </div>
              <div class="colorBlock" style="background-color: ${colors[dark]}" onclick="copyToClipboard('brand(${dark})');">
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
            <div class="colorBlock" style="background-color: ${value}" onclick="copyToClipboard('${family}(${color})');">
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

const install = async (hook, vm) => {
  const varSass = await loadJSON(vm.config.sassVar);

  hook.beforeEach((content) => renderColors(content, varSass.colors));
};

export default install;
