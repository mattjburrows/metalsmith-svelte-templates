'use strict';

const _omit = require('lodash.omit');
const path = require('path');
const compile = require('./lib/compile');

function getLayout(templates, { layout }) {
  return path.resolve(__dirname, `${templates}/${layout}`);
}

function getBase(base) {
  return path.resolve(__dirname, base);
}

function buildContentMap(file, contents) {
  return {
    [file]: { contents }
  };
}

function getComponent(files, file, templates) {
  const metalsmithNonComponentData = ['layout', 'mode', 'stats'];
  const componentData = _omit(files[file], metalsmithNonComponentData);
  const componentPath = getLayout(templates, files[file]);

  return compile(componentPath, componentData);
}

function getBaseComponent(baseComponentPath, contents, metadata) {
  const baseComponentData = Object.assign({ contents }, metadata);

  return compile(baseComponentPath, baseComponentData);
}

function getSvelteCompiledFiles(files, options, metalsmith) {
  const { templates, base } = options;
  const metadata = metalsmith.metadata();
  const baseComponentPath = getBase(base);

  return (accumulator, file) => {
    const component = getComponent(files, file, templates);
    const baseComponent = getBaseComponent(baseComponentPath, component.code, metadata);

    return Object.assign(buildContentMap(file, baseComponent.code), accumulator);
  }
}

function isMissingRequiredPluginOptions(options) {
  const requiredPluginOptionKeys = ['templates', 'base'];
  const optionKeys = Object.keys(options);

  return requiredPluginOptionKeys.filter(
    (requiredOption) => !optionKeys.includes(requiredOption)
  );
}

module.exports = function metalsmithSvelteTemplatesPlugin(options) {
  return function metalsmithSvelteTemplates(files, metalsmith) {
    const missingRequiredPluginOption = isMissingRequiredPluginOptions(options);

    if (missingRequiredPluginOption.length) {
      throw new Error(`You must specify "${missingRequiredPluginOption[0]}"`);
    }

    const svelteCompiledFiles = Object.keys(files).reduce(
      getSvelteCompiledFiles(files, options, metalsmith),
      {}
    );

    Object.assign(files, svelteCompiledFiles);
  }
}
