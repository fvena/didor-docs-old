import Prism from 'prismjs';


/**
 * constants
 */
const CODE_RESERVER_WORDS = /^\[```((.*\n)+?)?```\]$/gm;


/**
 * templates
 */
const template = {
  code(code, language) {
    return `<pre id="${language}" v-pre data-lang="${language}" class="tabcontent"><code class="lang-${language}">${code}</code></pre>`;
  },
};


/**
 * render
 */
function highligtCode(code) {
  const demo = code.trim().replace(/@DOCSIFY_QM@/g, '`');
  const highligt = Prism.highlight(
    demo,
    Prism.languages.markdown || Prism.languages.markup,
  );

  return template.code(highligt, 'markdown');
}


function renderCode(content) {
  let match = CODE_RESERVER_WORDS.exec(content);

  while (match != null) {
    const demo = highligtCode(`\`\`\`${match[1]}\`\`\``);
    content = content.replace(match[0], demo); // eslint-disable-line

    match = CODE_RESERVER_WORDS.exec(content);
  }

  return content;
}


/**
 * installation
 */
async function install(hook) {
  hook.beforeEach((content) => renderCode(content));
}

// eslint-disable-next-line
if (window.$docsify) window.$docsify.plugins = [].concat(install, $docsify.plugins);
