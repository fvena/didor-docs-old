// Load app style
import './styles/didor.scss';

// Scripts
import config from '../static/config.json';
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
import versions from './scripts/plugins/docsify-versions';


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
  versions,
].concat(window.$docsify.plugins || []);
