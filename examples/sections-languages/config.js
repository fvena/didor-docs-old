window.$docsify = {
  name: 'Didor Docs',
  loadNavbar: '../_navbar.md',
  languageDefault: 'es',
  onlyCover: true,
  coverpage: {
    '/': 'es/_coverpage.md',
    '/es/': '_coverpage.md',
    '/en/': '_coverpage.md',
  },
  alias: {
    '/': 'es/home',
    '/_navbar.md': 'es/_navbar.md',
    '/_sidebar.md': 'es/_sidebar.md',
  }
};
