const config = {
  name: 'Didor framework',
  repo: 'https://github.com/fvena/didor-framework2',
  homepage: 'home.md',
  api: {
    url: 'http://airzoneservice.airzonesl.es:3080/api/auth/v1/login',
    user: 'fvena@altracorporacion.es',
    password: 'foobarfoo',
  },
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
};
