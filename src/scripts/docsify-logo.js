const install = async (hook, vm) => {
  hook.mounted(() => {
    const logo = vm.config.logotype;

    if (logo) {
      document.styleSheets[0].addRule('.sidebar .app-name-link:before', `background-image: url(${logo}); display: block;`);
    }
  });
};

export default install;
