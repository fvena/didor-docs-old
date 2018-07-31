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
    return `<iframe id="example" srcdoc="${template.content(code, options)}" class="tabcontent" scrolling="no" frameborder="0" height="auto"></iframe>`;
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


/*
 * Resize iframes to adapt its content
 */
function autoResize(iframe) {
  setTimeout(() => {
    const body = iframe.contentWindow.document.body;
    const html = iframe.contentWindow.document.documentElement;
    const height = Math.max(body.offsetHeight, html.offsetHeight);

    iframe.style.visibility = 'hidden';
    iframe.style.height = '100px'; // reset to minimal height in case going from longer to shorter doc
    iframe.style.height = `${height + 5}px`;
    iframe.style.visibility = 'visible';
  }, 500);
}

function resizeIframe(event) {
  const iframe = event.currentTarget;
  autoResize(iframe);
}


/*
 * Resize all demo iframes to adapt its content
 */
function resizeAllDemoIframes() {
  const iframes = document.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    autoResize(iframe);
  });
}


function addResizeEvent() {
  window.addEventListener('resize', resizeAllDemoIframes);
}


function addIframeResizeEvent() {
  const iframes = document.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    iframe.addEventListener('load', resizeIframe);
  });
}

/**
 * installation
 */
const install = async (hook, vm) => {
  const options = Object.assign({}, DEFAULT_OPTIONS, vm.config.demo || {});

  hook.beforeEach((content) => renderDemo(content, options));
  hook.doneEach(() => {
    addResizeEvent();
    addIframeResizeEvent();
  });
};

export default install;
