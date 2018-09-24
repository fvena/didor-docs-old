/*
 * Estilos de la plantilla
 */
import './styles/didor.scss';


/*
 * Librerías
 */
import 'docsify';
import 'docsify-pagination';
import 'docsify-copy-code';
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es';
import _ from 'lodash';


/*
 * Plugins personalizados
 */
import demo from './scripts/docsify-demo';
import tabs from './scripts/docsify-tabs';
import helpers from './scripts/docsify-helpers';
import colors from './scripts/docsify-colors';
import icons from './scripts/docsify-icons';
import api from './scripts/docsify-api';
import logo from './scripts/docsify-logo';


/*
 * Personalizar la fecha de salida
 */
TimeAgo.locale(es);
const timeAgo = new TimeAgo('es');


/*
 * Configuración por defecto
 */
const defaultConfig = {
  name: 'Didor Docs',
  logotype: '/assets/img/logo.svg',
  homepage: 'home.md',
  loadSidebar: '_sidebar.md',
  mergeNavbar: true,
  auto2top: true,
  formatUpdated: (time) => timeAgo.format(new Date(time)),
  pagination: {
    previousText: 'Anterior',
    nextText: 'Siguiente',
  },
};


/*
 * Combino la configuración por defecto con la indicada por el usuario
 */
window.$docsify = _.merge({}, defaultConfig, window.$docsify);


/*
 * Añado las librerías personalizadas
 */
window.$docsify.plugins = [
  helpers,
  colors,
  icons,
  demo,
  tabs,
  api,
  logo,
].concat(window.$docsify.plugins || []);
