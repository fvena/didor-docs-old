function iconsDemo(icons){
  var content = '<div class="icons-demo">';

  for (var icon in icons) {
    content += `
      <div class="iconBlock" onclick="copyToClipboard('<i class=&quot;${icons[icon]}&quot;></i>');">
        <div class="iconBlock__icon">
          <i class="${icons[icon]}"></i>
        </div>
        <div class="iconBlock__name">.${icons[icon]}</div>
      </div>
    `;
  }

  content += '</div>';


  return content.replace(/\n/g, "")
    .replace(/[\t ]+\</g, "<")
    .replace(/\>[\t ]+\</g, "><")
    .replace(/\>[\t ]+$/g, ">")
}

async function install (hook, vm) {
  const varSass = await loadJSON('/src/sassVar.json');

  hook.beforeEach(function (content) {
    const reg = /^(?!\`\`\`\s)iconos\>(?!\s\`\`\`)$/gm;
    const icons = varSass.icons;

    let match = reg.exec(content);

    if (match) {
      return content.replace(match[0], iconsDemo(icons));
    }
  });
}

if (window.$docsify) window.$docsify.plugins = [].concat(install, $docsify.plugins)
