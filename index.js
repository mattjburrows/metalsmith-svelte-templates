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
  const componentData = _omit(files[file], ['layout', 'mode', 'stats']);
  const componentPath = getLayout(templates, files[file]);

  return compile(componentPath, componentData);
}

function getBaseComponent(basePath, component, metadata) {
  return compile(
    basePath,
    Object.assign(
      { contents: component },
      metadata
    )
  );
}

module.exports = function metalsmithSvelteTemplatesPlugin(options) {
  const { templates, base } = options;

  return function metalsmithSvelteTemplates(files, metalsmith) {
    if (!templates) {
      throw new Error('You must specify "templates"');
    }

    if (!base) {
      throw new Error('You must specify "base"');
    }

    const metadata = metalsmith.metadata();
    const basePath = getBase(base);
    const svelteCompilation = Object.keys(files).reduce((accumulator, file) => {
      const component = getComponent(files, file, templates);
      const baseComponent = getBaseComponent(basePath, component, metadata);

      return Object.assign(
        buildContentMap(file, baseComponent),
        accumulator
      );
    }, {});

    Object.assign(files, svelteCompilation);
  }
}
