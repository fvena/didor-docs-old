const install = async (hook, vm) => {
  const language = vm.config.languageDefault;

  hook.init(() => {
    window.$docsify.alias = {
      '/': `${language}/home`,
      '/_navbar.md': `${language}/_navbar.md`,
      '/_sidebar.md': `${language}/_sidebar.md`,
    };
  });
};


export default install;
