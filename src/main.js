// Load app style
import './styles/didor.scss';

// Scripts
// import './scripts/scripts/docsify';
import showTab from './scripts/scripts/tabs';
import apiRest from './scripts/scripts/apiRest';
import copyToClipboard from './scripts/scripts/copyToClipboard';
import { autoResize, resizeAllDemoIframes } from './scripts/scripts/resize';

// Plugins
import 'docsify';
import 'docsify-pagination';
import 'docsify-copy-code';
import demo from './scripts/plugins/docsify-demo';
import tabs from './scripts/plugins/docsify-tabs';
import helpers from './scripts/plugins/docsify-helpers';
import colors from './scripts/plugins/docsify-colors';
import icons from './scripts/plugins/docsify-icons';
import api from './scripts/plugins/docsify-api';

const config = {
  name: 'Didor framework',
  repo: 'https://github.com/fvena/didor-framework2',
  homepage: 'home.md',
  sassVar: '/static/sassVar.json',
  demo: {
    css: '/static/didor.css',
  },
  versions: [
    {
      name: '0.7.0',
      basePath: '/static/docs/',
    },
    {
      name: '0.8.0',
      basePath: '/static/docs/',
    },
    {
      name: '0.9.0',
      basePath: '/static/docs/',
    },
  ],
};


window.showTab = showTab;
window.copyToClipboard = copyToClipboard;
window.autoResize = autoResize;
window.resizeAllDemoIframes = resizeAllDemoIframes;
window.apiRest = apiRest;

window.$docsify = window.$docsify || {};
window.$docsify = {
  name: config.name,
  basePath: config.versions[config.versions.length - 1].basePath,
  repo: config.repo,
  homepage: config.homepage,
  formatUpdated: '{DD}/{MM} {HH}:{mm}',
  loadNavbar: '_navbar.md',
  loadSidebar: '_sidebar.md',
  mergeNavbar: true,
  auto2top: true,
  pagination: {
    previousText: 'Anterior',
    nextText: 'Siguiente',
  },
  demo: config.demo,
  sassVar: config.sassVar,
};


window.$docsify.plugins = [
  helpers,
  colors,
  icons,
  demo,
  tabs,
  api,
].concat(window.$docsify.plugins || []);
