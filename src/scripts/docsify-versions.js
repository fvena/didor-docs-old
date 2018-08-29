/**
 * Event when change select version
 */
async function changeVersion(event) {
  const version = event.currentTarget.value;

  window.location.href = version;
}


/**
 * Render Versions Select
 */
function renderVersions(versions) {
  // Build Select
  const getOptions = versions.reduce((options, version) => {
    const path = `#/${version.basePath}/${version.homePage}`;
    const name = version.name;
    return `${options}<option value="${path}">${name}</option>`;
  }, '');

  const template = `
    <div class="versions">
      <select>
        ${getOptions}
      </select>
    </div>
  `;


  // Get sidebar title and insert select
  const sidebar = document.querySelector('.sidebar h1');
  sidebar.insertAdjacentHTML('beforeend', template);


  // Get select and Add event
  const versionsSelect = document.querySelector('.sidebar .versions select');
  versionsSelect.addEventListener('change', changeVersion);
}


const install = async (hook, vm) => {
  const versions = vm.config.versions;

  hook.init(() => {
    if (versions.length) {
      const basePath = versions[0].basePath;
      window.$docsify.alias = {
        '/': `${basePath}/home`,
        '/_navbar.md': `${basePath}/_navbar.md`,
        '/_sidebar.md': `${basePath}/_sidebar.md`,
      };
    }
  });

  hook.mounted(() => {
    if (versions.length) {
      renderVersions(versions);
    }
  });
};


export default install;
