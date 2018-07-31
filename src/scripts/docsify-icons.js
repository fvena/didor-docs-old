import { parseHTML, loadJSON, copyToClipboard } from './docsify-utils';


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
        <div class="iconBlock" data-copy="<i class=&quot;${icons[icon]}&quot;></i>">
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


function copy(event) {
  const copyData = event.currentTarget.getAttribute('data-copy');
  copyToClipboard(copyData);
}


function addIconButtonEvent() {
  const iconsButtons = document.querySelectorAll('.iconBlock');

  iconsButtons.forEach((button) => {
    button.addEventListener('click', copy);
  });
}

const install = async (hook, vm) => {
  const varSass = await loadJSON(vm.config.sassVar);

  hook.beforeEach((content) => renderIcons(content, varSass.icons));
  hook.doneEach(() => { addIconButtonEvent(); });
};

export default install;
