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
    return `<pre id="${language}" v-pre data-lang="${language}" class="tabcontent"><code class="lang-${language}">${code}</code></pre>`;
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
      tabBar += '<li><a href="#example" class="tablinks">example</a></li>';
    }


    // Añado un link por cada código
    codeContainers.forEach((code) => {
      const language = code.getAttribute('data-lang');
      tabBar += `<li><a href="#${language}" class="tablinks">${language}</a></li>`;
    });

    tabBar += '</ul>';


    // Añado el 'tab nav' dentro del contenedor
    container.insertAdjacentHTML('afterbegin', tabBar);
    // container.querySelector('.tablinks').click();
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


/**
 * Muestra el tabcontent asociado al tablink seleccionado
 */
function showTab(event) {
  event.preventDefault();

  const tablink = event.currentTarget;
  const container = tablink.parentNode.parentNode.parentNode;
  const active = tablink.getAttribute('href');
  const tabcontent = container.querySelector(active);

  const tablinks = container.querySelectorAll('.tablinks');
  const tabcontents = container.querySelectorAll('.tabcontent');


  // Elimino la clase '.active' de todos los tablinks
  tablinks.forEach((item) => {
    item.className = item.className.replace(' active', '');
  });

  // Oculto todos los tabcontents
  tabcontents.forEach((item) => {
    item.style.display = 'none';
  });


  // Añado la clase 'active' al tablink seleccionado
  // y muestro el tabcontent correspondiente
  tablink.className += ' active';
  tabcontent.style.display = 'block';
}

function addTabsEvent() {
  const tabsBlocks = document.querySelectorAll('.tab');
  const tabs = document.querySelectorAll('.tablinks');

  tabs.forEach((tab) => {
    tab.addEventListener('click', showTab);
  });

  tabsBlocks.forEach((block) => {
    const tabBlock = block.querySelector('.tablinks');
    tabBlock.click();
  });
}

const install = async (hook) => {
  hook.beforeEach((content) => renderCode(content));
  hook.doneEach(() => {
    demoView();
    addTabsEvent();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });
};

export default install;
