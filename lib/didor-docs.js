/* eslint no-console: 0 */

const serveStatic = require('serve-static');
const chalk = require('chalk'); // Colorea las salidas del terminal
const connect = require('connect');
const livereload = require('connect-livereload');
const lrserver = require('livereload');
const open = require('opn');
const path = require('path');
const pathExists = require('path-exists'); // Comprueba si existe un directorio


/**
 * Inicializa un servidor local para ver la documentación
 * @param  {string}     dir            [Ruta de la documentación]
 * @param  {object}     config         [Parametros de configuración]
 *    @param  {boolean} open           [Abre la documentación en el navegador por defecto]
 *    @param  {integer} port           [Puerto de la documentación]
 *    @param  {integer} liveReloadPort [Puerto para el liveReload]
 */
module.exports = async (dir, config) => {
  try {
    /*
     * Compruebo si existe el directorio con la documentación
     */
    const docsBasePath = process.cwd() + dir;
    const validateDocsFolder = await pathExists(docsBasePath)
      .then(exists => exists);

    if (!validateDocsFolder) {
      console.log(`${chalk.red('Error al generar la documentación:')} No se encuentra el directorio ${dir}`);
      return false;
    }


    /*
     * Levanto un servidor para mostrar la documentación
     */
    const server = connect();
    server.use(livereload({ port: config.liveReloadPort }));

    server.use('/docs', serveStatic(docsBasePath));
    server.use(serveStatic(path.join(__dirname, '../dist')));
    server.listen(config.port);

    lrserver.createServer({
      exts: ['md'],
      exclusions: ['node_modules/'],
      port: config.liveReloadPort,
    }).watch(docsBasePath);


    /*
     * Abro la página en el navegador por defacto si se ha indicado
     */
    if (config.open) {
      open(`http://localhost:${config.port}`);
    }


    /*
     * Indico el puerto donde se está ejecutando la documentación
     */
    const msg = `\nServing ${chalk.green(dir)} now.\nListening at ${chalk.green(`http://localhost:${config.port}`)}.\n`;
    console.log(msg);

    return true;
  } catch (error) {
    if (error) {
      console.log(chalk.red('Ha ocurrido un error'));
      console.log(error);
    }

    return false;
  }
};
