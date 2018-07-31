import axios from 'axios';
import Prism from 'prismjs';
import { parseHTML } from './docsify-utils';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';

/*
 * docsify-plugin-api
 *
 * Plugin for documentation and check an api rest
 */


/*
 * Templates
 */
const templates = {
  apiBlock(apiBlock) {
    return `
      <article class="apiBlock">
        <div class="apiDoc">${apiBlock}</div>
        <div class="apiCode"></div>
      </article>
    `;
  },

  apiExample(data, params, id) {
    return `
      <div class="apiExample">
        <form class="apiForm" data-url="${data.url}" data-method="${data.method}" data-pos="apiResult${id}" autocomplete="off">
          <div class="apiForm__header">
            <div class="apiForm__header__method">${data.method}</div>
            <div class="apiForm__header__url">${data.url}</div>
            <button class="apiForm__header__submit">Probar</button>
          </div>
          ${params}
        </form>
        <div id="apiResult${id}" class="apiExampleResult"></div>
      </div>
    `;
  },

  apiFormRow(param) {
    return `
      <div class="apiForm__row">
        <div class="apiForm__name">
          <input type="checkbox" ${(param.required) ? 'checked disabled' : ''}>
          <label>${param.name}</label>
        </div>
        <input class="apiForm__input" type="text" name="${param.name}" value="${(param.default) ? param.default : ''}" placeholder="null">
      </div>
    `;
  },

  paramsTable(paramsRow) {
    return `
      <div>
        <table>
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            ${paramsRow}
          </tbody>
        </table>
      </div>
    `;
  },

  paramTableRow(param) {
    return `
      <tr>
        <td><code>${param.name}</code></td>
        <td><code>${param.type}</code></td>
        <td>${param.description}</td>
        <td>${param.default}</td>
      </tr>
    `;
  },

  apiUrl(methodClass, methodName, url) {
    return `
      <div class="apiUrl">
        <span class="apiUrl__method ${methodClass}">${methodName}</span>
        ${url}
      </div>
    `;
  },

  generateSuccessHTMLOutput(response) {
    return `
      <div class="apiCode__title">Response Status:</div>
      <pre data-lang="json"><code class="lang-json">${response.status} ${response.statusText}</code></pre>
      <div class="apiCode__title">Response Headers:</div>
      <pre data-lang="json"><code class="lang-json">${JSON.stringify(response.headers, null, '\t')}</code></pre>
      <div class="apiCode__title">Response Data:</div>
      <pre data-lang="json"><code class="lang-json">${JSON.stringify(response.data, null, '\t')}</code></pre>
    `;
  },

  generateErrorHTMLOutput(error) {
    return `
      <div class="apiCode__title">Error Message:</div>
      <pre data-lang="json"><code class="lang-json">${error.message}</code></pre>
      <div class="apiCode__title">Error Status:</div>
      <pre data-lang="json"><code class="lang-json">${error.response.status} ${error.response.statusText}</code></pre>
      <div class="apiCode__title">Error Headers:</div>
      <pre data-lang="json"><code class="lang-json">${JSON.stringify(error.response.headers, null, '\t')}</code></pre>
      <div class="apiCode__title">Error Data:</div>
      <pre data-lang="json"><code class="lang-json">${JSON.stringify(error.response.data, null, '\t')}</code></pre>
    `;
  },
};


/*
 * Check if is an api document
 */
function isApiDoc(content) {
  const api = content.startsWith('api>');
  return api;
}


/*
 * Highlight a code of block with Prism lib
 */
function codeHighlight(_code, _title, _language) {
  const language = _language || 'js';
  const prismLanguage = Prism.languages[language] || Prism.languages.markup;
  const title = (_title) ? `<div class="apiCode__title">${_title}</div>` : '';
  const code = _code.trim().replace(/@DOCSIFY_QM@/g, '`');
  const highlight = Prism.highlight(code, prismLanguage);

  return `<div class="apiCodeExample">${title}<pre id="${language}" v-pre data-lang="${language}" class="tabcontent"><code class="lang-${language}">${highlight}</code></pre></div>`;
}


/*
 * Generate api example
 */
function apiExample(data, id) {
  let params = '';
  let paramsRow = '';
  let template = '';

  data.params.forEach((param) => {
    params += templates.apiFormRow(param);
    paramsRow += templates.paramTableRow(param);
  });

  template += templates.apiExample(data, params, id);
  template += (paramsRow) ? templates.paramsTable(paramsRow) : '';

  return parseHTML(template);
}


/*
 * Highlight code blocks of content;
 *
 * Search and replace with highlight code all next expression in code:
 * ```apiCode[js](Title of block)
 *
 * ```
 */
function contentCodeHighlight(content) {
  const REG_CODE = /```apiCode(\[(.*)?\])?(\((.*)?\))?((.*\n)+?)?```/gm;
  let matchCode = REG_CODE.exec(content);

  while (matchCode != null) {
    const original = matchCode[0];
    const code = matchCode[5];
    const title = matchCode[4];
    const language = matchCode[2];
    const highlight = codeHighlight(code, title, language);

    content = content.replace(original, highlight);
    matchCode = REG_CODE.exec(content);
  }

  return content;
}


/*
 * Generate api examples
 *
 * Search and replace with api real example all next expression in content:
 * ```apiExample
 *
 * ```
 */
function generateApiExample(content) {
  const REG_EXAMPLE = /```apiExample((.*\n)+?)?```/gm;
  let matchExample = REG_EXAMPLE.exec(content);
  let pos = 0;

  while (matchExample !== null) {
    const original = matchExample[0];
    const data = JSON.parse(matchExample[1]);
    const example = apiExample(data, pos);

    pos += 1;
    content = content.replace(original, example);
    matchExample = REG_EXAMPLE.exec(content);
  }

  return content;
}


/*
 * Parse Api url in a beautiful color block;
 *
 * Search and replace with beautiful block all next expression in code:
 * ```apiCode[js](Title of block)
 *
 * ```
 */
function parseApiUrl(content) {
  const REG_URL = /^(?!```\s)apiUrl(\[(.*)?\])?(\((.*)?\))?((.*)+?)?(?!\s```)$/gm;
  let matchUrl = REG_URL.exec(content);

  while (matchUrl != null) {
    const original = matchUrl[0];
    const methodClass = matchUrl[2].toLowerCase();
    const methodName = matchUrl[2];
    const url = matchUrl[4];
    const urlParse = templates.apiUrl(methodClass, methodName, url);

    content = content.replace(original, parseHTML(urlParse));
    matchUrl = REG_URL.exec(content);
  }

  return content;
}


/*
 * Parse Api method in a section title;
 *
 * Search and replace with beautiful title all next expression in code:
 *
 * ## (GET|POST|PUT|DELETE|PATCH) Mí título
 *
 */
function parseApiMethodTitle(content) {
  const REG_METHOD = /## (GET|POST|PUT|DELETE|PATCH)+?/gm;
  let matchTitleMethod = REG_METHOD.exec(content);

  while (matchTitleMethod !== null) {
    const original = matchTitleMethod[0];
    const methodClass = matchTitleMethod[1].toLowerCase();
    const method = matchTitleMethod[1];
    const titleParse = `## <span class="apiMethod ${methodClass}">${method}</span>`;

    content = content.replace(original, titleParse);
    matchTitleMethod = REG_METHOD.exec(content);
  }

  return content;
}


/*
 * Parse content to Api docs
 */
function parseApiDoc(content) {
  content = content.substring(4); // Remove `api>` tag from content
  content = contentCodeHighlight(content);
  content = generateApiExample(content);
  content = parseApiUrl(content);
  content = parseApiMethodTitle(content);
  return content;
}


/*
 * Split html in blocks
 */
function splitApiBlock(html) {
  const apiBlocks = html.split('<p>apiBlock&gt;</p>');
  let content = '';

  apiBlocks.shift(); // Remove first element
  apiBlocks.forEach((apiBlock) => {
    content += templates.apiBlock(apiBlock);
  });

  return content;
}


/*
 * Get data to send request
 */
function getParams(form, method) {
  const params = {};

  for (let i = 0; i < form.length; i += 1) {
    const input = form.elements[i];

    if (input.type === 'checkbox' && input.checked) {
      const name = input.parentNode.nextSibling.name;
      const value = input.parentNode.nextSibling.value;

      params[name] = value;
    }
  }

  return (method === 'get') ? { params } : params;
}


/*
 * Api request event
 */
async function apiRest(event) {
  event.preventDefault();

  const form = event.currentTarget.parentNode.parentNode;
  const url = form.getAttribute('data-url');
  const method = form.getAttribute('data-method').toLowerCase();
  const id = form.getAttribute('data-pos');
  const params = await getParams(form, method);
  const token = localStorage.getItem('airzoneDoc-token') || '';

  let result = '';

  document.getElementById(id).innerHTML = 'Cargando...';

  if (method === 'get') {
    await axios[method](url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        result = templates.generateSuccessHTMLOutput(response);
      })
      .catch((error) => {
        result = templates.generateErrorHTMLOutput(error);
      });
  } else {
    await axios[method](url, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        result = templates.generateSuccessHTMLOutput(response);
      })
      .catch((error) => {
        result = templates.generateErrorHTMLOutput(error);
      });
  }

  document.getElementById(id).innerHTML = result;

  Prism.highlightAll();
}


/*
 * Move.apiCodeExample and apiExample blocks to apicode block
 */
function moveExamplesBlocks() {
  const apiBlock = document.querySelectorAll('.apiBlock');

  apiBlock.forEach((block) => {
    const apiCodeExample = block.querySelectorAll('.apiCodeExample, .apiExample');

    apiCodeExample.forEach((code) => {
      block.querySelector('.apiCode').appendChild(code);
    });
  });
}


/*
 * Add event click to submit buttons
 */
function addEventSubmitButtons() {
  const submitButtons = document.querySelectorAll('.apiForm__header__submit');

  submitButtons.forEach((button) => {
    button.addEventListener('click', apiRest);
  });
}


/*
 * Plugin core
 */
const install = async (hook) => {
  let api = false;

  /*
   * Invoked each time before parsing the Markdown file.
   */
  hook.beforeEach((content) => {
    api = isApiDoc(content);

    return (api) ? parseApiDoc(content) : content;
  });


  /*
   * Invoked each time after the Markdown file is parsed.
   */
  hook.afterEach((html, next) => {
    const content = (api) ? splitApiBlock(html) : html;
    const submenuLevel = (api) ? 2 : 0;

    window.$docsify.subMaxLevel = submenuLevel;
    next(content);
  });


  /*
   * Invoked each time after the data is fully loaded.
   */
  hook.doneEach(() => {
    const body = document.querySelector('body');

    if (api) {
      body.className += ' apiSection';
      moveExamplesBlocks();
      addEventSubmitButtons();
    } else {
      body.className = body.className.replace(' apiSection', '');
    }
  });
};

export default install;
