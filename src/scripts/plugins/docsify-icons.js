import { parseHTML, loadJSON } from './docsify-utils';


/**
 * constants
 */
const ICONS_BLOCK = /^iconos>$/gm;


/**
 * templates
 */
function iconsDemo(icons) {
  let content = '<div class="icons-demo">';

  // eslint-disable-next-line
  for (let icon in icons) {
    if ({}.hasOwnProperty.call(icons, icon)) {
      content += `
        <div class="iconBlock" onclick="copyToClipboard('<i class=&quot;${icons[icon]}&quot;></i>');">
          <div class="iconBlock__icon">
            <i class="${icons[icon]}"></i>
          </div>
          <div class="iconBlock__name">.${icons[icon]}</div>
        </div>
      `;
    }
  }

  content += '</div>';


  return parseHTML(content);
}


/**
 * render
 */
function renderIcons(content, icons) {
  const match = ICONS_BLOCK.exec(content);

  return (match) ? content.replace(match[0], iconsDemo(icons)) : content;
}

const install = async (hook, vm) => {
  const varSass = await loadJSON(vm.config.sassVar);

  hook.beforeEach((content) => renderIcons(content, varSass.icons));
};

export default install;
