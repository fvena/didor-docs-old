// Load app style
import './styles/didor.scss';

// Scripts
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es';

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
import logo from './scripts/docsify-logo';

TimeAgo.locale(es);
const timeAgo = new TimeAgo('es');

window.$docsify.formatUpdated = (time) => timeAgo.format(new Date(time));


window.$docsify.plugins = [
  helpers,
  colors,
  icons,
  demo,
  tabs,
  api,
  versions,
  logo,
].concat(window.$docsify.plugins || []);
