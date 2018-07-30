import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';


/**
 * constants
 */
const CODE_TABS = /^```\[(.*)+?\]((.*\n)+?)?```$/gm;


/**
 * templates
 */
const template = {
  code(code, language) {
    return `<pre id="${language}" v-pre data-lang="${language}" class="tabcontent line-numbers"><code class="lang-${language}">${code}</code></pre>`;
  },
};


/**
 * Genera y añade de forma dinámica un 'tab nav' al ejemplo que permite alternar
 * entre el ejemplo y el código
 */
function demoView() {
  const containers = document.querySelectorAll('.blockExample'); // Listado de todos los ejemplos

  // Trabajo sobre cada demo por separado
  containers.forEach((container) => {
    const exampeContainer = container.querySelector('iframe'); // Iframe con el ejemplo
    const codeContainers = container.querySelectorAll('pre[data-lang]'); // Listado de los códigos que acompañan al ejemplo

    // Inicio de la plantilla
    let tabBar = '<ul class="tab">';


    // Si hay ejemplo añado su link
    if (exampeContainer) {
      tabBar += '<li><a href="#example" class="tablinks" onclick="showTab(event)">example</a></li>';
    }


    // Añado un link por cada código
    codeContainers.forEach((code) => {
      const language = code.getAttribute('data-lang');
      tabBar += `<li><a href="#${language}" class="tablinks" onclick="showTab(event)">${language}</a></li>`;
    });

    tabBar += '</ul>';


    // Añado el 'tab nav' dentro del contenedor
    container.insertAdjacentHTML('afterbegin', tabBar);
    container.querySelector('.tablinks').click();
  });
}


/**
 * render
 */
function highligtCode(code, language) {
  const demo = code.trim().replace(/@DOCSIFY_QM@/g, '`');
  const highligt = Prism.highlight(
    demo,
    Prism.languages[language],
  );

  return template.code(highligt, language);
}


function renderCode(content) {
  let match = CODE_TABS.exec(content);

  while (match != null) {
    const demo = highligtCode(match[2], match[1]);
    content = content.replace(match[0], demo); // eslint-disable-line

    match = CODE_TABS.exec(content);
  }

  return content;
}


const install = async (hook) => {
  hook.beforeEach((content) => renderCode(content));
  hook.doneEach(() => {
    demoView();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
};

export default install;
