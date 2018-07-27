function apiCode(code, title, language) {
  language = (language) ? language : 'js';
  title = (title) ? `<div class="apiCode__title">${title}</div>` : '';
  code = code.trim().replace(/@DOCSIFY_QM@/g, '`');
  const hl = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.markup
  )

  return `<div class="apiCodeExample">${title}<pre id="${language}" v-pre data-lang="${language}" class="tabcontent"><code class="lang-${language}">${hl}</code></pre></div>`
}

function apiExample(data, id) {
  let params = '';
  let paramsRow = '';
  let template = '';

  data.params.forEach((param) => {
    params += `<div class="apiForm__row">
                <div class="apiForm__name">
                  <input type="checkbox" ${(param.required) ? 'checked disabled' : '' }>
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
          <button class="apiForm__header__submit" onclick="api(event)">Probar</button>
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

  return template
    .replace(/\n/g, '')
    .replace(/[\t ]+</g, '<')
    .replace(/>[\t ]+</g, '><')
    .replace(/>[\t ]+$/g, '>');
}

async function install(hook, vm) {
  let api = false;

  hook.beforeEach((content) => {
    api = content.startsWith('api>');

    if (api) {
      content = content.substring(4);

      const regCode = /(?!```\s)```apiCode(\[(.*)?\])?(\((.*)?\))?((.*\n)+?)?```(?!\s```)/gm;
      const regExample = /(?!```\s)```apiExample((.*\n)+?)?```(?!\s```)/gm;
      const regUrl = /^(?!```\s)apiUrl(\[(.*)?\])?(\((.*)?\))?((.*)+?)?(?!\s```)$/gm;
      const regTitleMethod = /## (GET|POST|PUT|DELETE|PATCH)+?/gm;

      // apiCode
      let matchCode = regCode.exec(content);

      while (matchCode != null) {
        const code = apiCode(matchCode[5], matchCode[4], matchCode[2]);
        content = content.replace(matchCode[0], code);
        matchCode = regCode.exec(content);
      }


      // apiUrl
      let matchUrl = regUrl.exec(content);

      while (matchUrl != null) {
        let template = (`
          <div class="apiUrl">
            <span class="apiUrl__method ${matchUrl[2].toLowerCase()}">${matchUrl[2]}</span>
            ${matchUrl[4]}
          </div>
        `).replace(/\n/g, '')
          .replace(/[\t ]+</g, '<')
          .replace(/>[\t ]+</g, '><')
          .replace(/>[\t ]+$/g, '>');

        content = content.replace(matchUrl[0], template);
        matchUrl = regUrl.exec(content);
      }


      // apiExample
      let matchExample = regExample.exec(content);
      let pos = 0;

      while (matchExample !== null) {
        const example = apiExample(JSON.parse(matchExample[1]), pos);
        content = content.replace(matchExample[0], example);
        pos++;
        matchExample = regExample.exec(content);
      }


      // apiTitleMethod
      let matchTitleMethod = regTitleMethod.exec(content);

      while (matchTitleMethod !== null) {
        const titleMethod = `## <span class="apiMethod ${matchTitleMethod[1].toLowerCase()}">${matchTitleMethod[1]}</span>`;
        content = content.replace(matchTitleMethod[0], titleMethod);
        matchTitleMethod = regTitleMethod.exec(content);
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
}

if (window.$docsify) window.$docsify.plugins = [].concat(install, $docsify.plugins)
