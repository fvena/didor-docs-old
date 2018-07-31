// Load app style
import './styles/didor.scss';

// Scripts
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es';
import config from '../static/config.json';

// Plugins
import 'docsify';
import 'docsify-pagination';
import 'docsify-copy-code';
import demo from './scripts/docsify-demo';
import tabs from './scripts/docsify-tabs';
import helpers from './scripts/docsify-helpers';
import colors from './scripts/docsify-colors';
import icons from './scripts/docsify-icons';
import api from './scripts/docsify-api';
import versions from './scripts/docsify-versions';

TimeAgo.locale(es);
const timeAgo = new TimeAgo('es');

window.$docsify = window.$docsify || {};
window.$docsify = {
  name: config.name,
  basePath: config.versions[config.versions.length - 1].basePath,
  repo: config.repo,
  homepage: config.homepage,
  formatUpdated: (time) => timeAgo.format(new Date(time)),
  loadNavbar: '_navbar.md',
  loadSidebar: '_sidebar.md',
  routerMode: 'hash',
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
