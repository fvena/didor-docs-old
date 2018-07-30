import Prism from 'prismjs';
import { parseHTML } from './docsify-utils';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';


/**
 * constants
 */

const REG_CODE = /(?!```\s)```apiCode(\[(.*)?\])?(\((.*)?\))?((.*\n)+?)?```(?!\s```)/gm;
const REG_EXAMPLE = /(?!```\s)```apiExample((.*\n)+?)?```(?!\s```)/gm;
const REG_URL = /^(?!```\s)apiUrl(\[(.*)?\])?(\((.*)?\))?((.*)+?)?(?!\s```)$/gm;
const REG_METHOD = /## (GET|POST|PUT|DELETE|PATCH)+?/gm;


function apiCode(code, title, language) {
  language = language || 'js';
  title = (title) ? `<div class="apiCode__title">${title}</div>` : '';
  code = code.trim().replace(/@DOCSIFY_QM@/g, '`');
  const hl = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.markup,
  );

  return `<div class="apiCodeExample">${title}<pre id="${language}" v-pre data-lang="${language}" class="tabcontent"><code class="lang-${language}">${hl}</code></pre></div>`;
}


function apiExample(data, id) {
  let params = '';
  let paramsRow = '';
  let template = '';

  data.params.forEach((param) => {
    params += `<div class="apiForm__row">
                <div class="apiForm__name">
                  <input type="checkbox" ${(param.required) ? 'checked disabled' : ''}>
                  <label>${param.name}</label>
                </div>
                <input class="apiForm__input" type="text" name="${param.name}" value="${(param.default) ? param.default : ''}" placeholder="null">
              </div>`;

    paramsRow += `
      <tr>
        <td><code>${param.name}</code></td>
        <td><code>${param.type}</code></td>
        <td>${param.description}</td>
        <td>${param.default}</td>
      </tr>
    `;
  });

  template += `
    <div class="apiExample">
      <form class="apiForm" data-url="${data.url}" data-method="${data.method}" data-pos="apiResult${id}" autocomplete="off">
        <div class="apiForm__header">
          <div class="apiForm__header__method">${data.method}</div>
          <div class="apiForm__header__url">${data.url}</div>
          <button class="apiForm__header__submit" onclick="apiRest(event)">Probar</button>
        </div>
        ${params}
      </form>
      <div id="apiResult${id}" class="apiExampleResult"></div>
    </div>
  `;

  if (paramsRow) {
    template += `
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
  }

  return parseHTML(template);
}


const install = async (hook) => {
  let api = false;

  hook.beforeEach((content) => {
    api = content.startsWith('api>');

    if (api) {
      content = content.substring(4);

      // apiCode
      let matchCode = REG_CODE.exec(content);

      while (matchCode != null) {
        const code = apiCode(matchCode[5], matchCode[4], matchCode[2]);
        content = content.replace(matchCode[0], code);
        matchCode = REG_CODE.exec(content);
      }


      // apiUrl
      let matchUrl = REG_URL.exec(content);

      while (matchUrl != null) {
        const template = (`
          <div class="apiUrl">
            <span class="apiUrl__method ${matchUrl[2].toLowerCase()}">${matchUrl[2]}</span>
            ${matchUrl[4]}
          </div>
        `);

        content = content.replace(matchUrl[0], parseHTML(template));
        matchUrl = REG_URL.exec(content);
      }


      // apiExample
      let matchExample = REG_EXAMPLE.exec(content);
      let pos = 0;

      while (matchExample !== null) {
        const example = apiExample(JSON.parse(matchExample[1]), pos);
        content = content.replace(matchExample[0], example);
        pos += 1;
        matchExample = REG_EXAMPLE.exec(content);
      }


      // apiTitleMethod
      let matchTitleMethod = REG_METHOD.exec(content);

      while (matchTitleMethod !== null) {
        const titleMethod = `## <span class="apiMethod ${matchTitleMethod[1].toLowerCase()}">${matchTitleMethod[1]}</span>`;
        content = content.replace(matchTitleMethod[0], titleMethod);
        matchTitleMethod = REG_METHOD.exec(content);
      }
    }

    return content;
  });

  hook.afterEach((html, next) => {
    let content = html;

    if (api) {
      const apiBlocks = html.split('<p>apiBlock&gt;</p>');
      content = '';

      apiBlocks.shift();
      apiBlocks.forEach((apiBlock) => {
        content += `
          <article class="apiBlock">
            <div class="apiDoc">${apiBlock}</div>
            <div class="apiCode"></div>
          </article>
        `;
      });

      window.$docsify.subMaxLevel = 2;
    } else {
      window.$docsify.subMaxLevel = 0;
    }

    next(content);
  });

  hook.doneEach(() => {
    if (api) {
      document.querySelector('body').className += ' apiSection';

      const apiBlock = document.querySelectorAll('.apiBlock');

      apiBlock.forEach((block) => {
        const apiCodeExample = block.querySelectorAll('.apiCodeExample, .apiExample');

        apiCodeExample.forEach((code) => {
          block.querySelector('.apiCode').appendChild(code);
        });
      });
    } else {
      document.querySelector('body').className = document.querySelector('body').className.replace(' apiSection', '');
    }
  });
};

export default install;
