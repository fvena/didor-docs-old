import config from '../../../static/config.json';

function renderVersions(versions) {
  const sidebar = document.querySelector('.sidebar h1');

  let template = '<div class="versions"><select>';

  versions.forEach((version) => {
    template += `<option value="${version.basePath}">${version.name}</option>`;
  });

  template += '</select></div>';

  sidebar.insertAdjacentHTML('beforeend', template);
}

const install = async (hook) => {
  const versions = config.versions;

  hook.mounted(() => renderVersions(versions));
};

export default install;
