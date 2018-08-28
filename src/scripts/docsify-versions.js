function renderVersions(versions) {
  const sidebar = document.querySelector('.sidebar h1');

  let template = '<div class="versions"><select>';

  versions.forEach((version) => {
    template += `<option value="#/${version.basePath}/${version.homePage}">${version.name}</option>`;
  });

  template += '</select></div>';

  sidebar.insertAdjacentHTML('beforeend', template);
}


async function changeVersion(event) {
  const version = event.currentTarget.value;

  window.location.href = version;
}


function addEventChangeVersion() {
  const versionsSelect = document.querySelector('.sidebar .versions select');

  versionsSelect.addEventListener('change', changeVersion);
}

const install = async (hook, vm) => {
  const versions = vm.config.versions;

  hook.init(() => {
    if (versions.length) {
      window.location.homepage = versions[0].homePage;
      window.location.basePath += versions[0].basePath;
      window.location.alias = {};

      let first = true;

      versions.forEach((version) => {
        if (first) {
          window.location.alias[`/${version.basePath}/(.*)`] = '/$1';
        } else {
          window.location.alias[`/${version.basePath}/(.*)`] = `../${version.basePath}/$1`;
        }

        first = false;
      });
    }
  });


  hook.mounted(() => {
    if (versions.length) {
      renderVersions(versions);
      addEventChangeVersion();
    }
  });
};

export default install;
