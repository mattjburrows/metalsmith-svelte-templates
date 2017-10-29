require('svelte/ssr/register');

function getComponentCSS(component, { inlineCSS }) {
  if (inlineCSS) {
    const { css } = component.renderCss();

    return { css };
  }
}

module.exports = function svelteCompile(componentPath, data) {
  const component = require(componentPath);
  const code = component.render(data);

  return Object.assign(
    { code },
    getComponentCSS(component, data)
  );
}
