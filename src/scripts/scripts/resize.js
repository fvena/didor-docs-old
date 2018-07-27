/*
 * Resize iframes to adapt its content
 */
function autoResize(iframe) {
  setTimeout(() => {
    const body = iframe.contentWindow.document.body;
    const html = iframe.contentWindow.document.documentElement;
    const height = Math.max(body.scrollHeight, body.offsetHeight, html.offsetHeight);

    iframe.style.visibility = 'hidden';
    iframe.style.height = '100px'; // reset to minimal height in case going from longer to shorter doc
    iframe.style.height = `${height + 5}px`
    iframe.style.visibility = 'visible';
  }, 500);
}


/*
 * Resize all demo iframes to adapt its content
 */
function resizeAllDemoIframes() {
  const iframes = document.querySelectorAll('iframe');

  for (let i = 0; i < iframes.length; i++) {
    autoResize(iframes[i]);
  }
}
