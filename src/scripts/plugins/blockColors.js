function loadJSON(file) {
  return new Promise(function(resolve, reject) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == '200') {
        resolve(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
  });
}

function colorsDemo(colors, family) {
  var content = '<div class="colors-demo">';

  if (family === 'brand')
    for (var color in colors) {
      var value = colors[color];

      if (!color.endsWith('-dark') && !color.endsWith('-light')) {
        var dark = color + '-dark';
        var light = color + '-light';

        content += `
          <div class="colorBlock__col">
            <div class="colorBlock" style="background-color: ${colors[light]}" onclick="copyToClipboard('brand(${light})');">
              <div class="colorBlock__name">
                ${light}
                <div class="colorBlock__hex">${colors[light]}</div>
              </div>
            </div>
            <div class="colorBlock" style="background-color: ${value}" onclick="copyToClipboard('brand(${color})');">
              <div class="colorBlock__name">
                ${color}
                <div class="colorBlock__hex">${value}</div>
              </div>
            </div>
            <div class="colorBlock" style="background-color: ${colors[dark]}" onclick="copyToClipboard('brand(${dark})');">
              <div class="colorBlock__name">
                ${dark}
                <div class="colorBlock__hex">${colors[dark]}</div>
              </div>
            </div>
          </div>
        `;
      }
    }
  } else {
    for (var color in colors) {
      var value = colors[color];

      content += `
        <div class="colorBlock__col">
          <div class="colorBlock" style="background-color: ${value}" onclick="copyToClipboard('${family}(${color})');">
            <div class="colorBlock__name">
              ${color}
              <div class="colorBlock__hex">${value}</div>
            </div>
          </div>
        </div>
      `;
    }
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
    const reg = /^(?!\`\`\`\s)colors\[(.*)+?\]\>(?!\s\`\`\`)$/gm;
    const colors = varSass.colors;

    let match = reg.exec(content);

    while (match != null) {
      content = content.replace(match[0], colorsDemo(colors[match[1]],match[1]));
      match = reg.exec(content);
    }

    return content;
  });
}

if (window.$docsify) window.$docsify.plugins = [].concat(install, $docsify.plugins)
