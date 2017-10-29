require('svelte/ssr/register');

module.exports = function svelteCompile(componentPath, data) {
  const component = require(componentPath);
  const code = component.render(data);

  return { code };
}
