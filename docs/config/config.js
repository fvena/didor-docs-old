// const config = {
//   api: {
//     url: 'http://airzoneservice.airzonesl.es:3080/api/auth/v1/login',
//     user: 'fvena@altracorporacion.es',
//     password: 'foobarfoo',
//   },
// };

window.$docsify = {
  name: 'Didor Docs',
  logotype: '/static/img/logo.svg',
  basePath: '/docs',
  repo: 'https://github.com/fvena/didor-docs',
  homepage: 'home.md',
  loadNavbar: '_navbar.md',
  loadSidebar: '_sidebar.md',
  mergeNavbar: true,
  auto2top: true,
  languageDefault: 'es',
  demo: {
    css: 'docs/config/didor.css',
  },
  pagination: {
    previousText: 'Anterior',
    nextText: 'Siguiente',
  },
};
