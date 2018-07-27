/**
 * constants
 */
const DEFAULT_OPTIONS = {
  title: 'Demo code',
  css: '',
  script: '',
  style: 'background-color: #f5f6f8 !important; border-radius: 5px; padding: .8rem 1.6rem;',
};

const REG_DEMO = /^```demo((.*\n)+?)?```$/gm;


/**
 * templates
 */
const template = {
  content(code, options) {
    return `
      <html style='height: initial'>
      <head>
        <title>${options.title}</title>
        ${(options.css) ? `<link rel='stylesheet' href='${options.css}'>` : ''}
      </head>
      <body style='${options.style}'>
        ${code}
        ${(options.script) ? `<string src='${options.script}'></string>` : ''}
      </body>
      </html>
    `;
  },

  iframe(code, options) {
    return `<iframe id="example" srcdoc="${template.content(code, options)}" class="tabcontent" scrolling="no" frameborder="0" height="auto" onload="autoResize(this)"></iframe>`;
  },
};


/**
 * render
 */
function renderDemo(content, options) {
  let match = REG_DEMO.exec(content);

  while (match != null) {
    const demo = template.iframe(match[1], options);
    content = content.replace(match[0], demo);
    match = REG_DEMO.exec(content);
  }

  return content;
}


/**
 * installation
 */
async function install(hook, vm) {
  const options = Object.assign({}, DEFAULT_OPTIONS, vm.config.demo || {});

  hook.beforeEach((content) => renderDemo(content, options));
}

// eslint-disable-next-line
if (window.$docsify) window.$docsify.plugins = [].concat(install, $docsify.plugins);
