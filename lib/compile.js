require('svelte/ssr/register');

module.exports = function svelteCompile(componentPath, data) {
  const component = require(componentPath);

  return component.render(data);
}
