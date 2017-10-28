'use strict';

const assert = require('assert');
const Metalsmith = require('metalsmith');
const cheerio = require('cheerio');
const svelte = require('../');

describe('Metalsmith Svelte templates', () => {
  it('throws an error when { templates } has not been specified', (done) => {
    Metalsmith(__dirname)
      .source('./src')
      .destination('./dist')
      .use(svelte({
        base: `${__dirname}/layouts/base.html`
      }))
      .build((err, files) => {
        assert.ok(err);
        assert.equal(err.message, 'You must specify "templates"');
        assert.ifError(files);

        done();
      });
  });

  it('throws an error when { base } has not been specified', (done) => {
    Metalsmith(__dirname)
      .source('./src')
      .destination('./dist')
      .use(svelte({
        templates: `${__dirname}/templates`,
      }))
      .build((err, files) => {
        assert.ok(err);
        assert.equal(err.message, 'You must specify "base"');
        assert.ifError(files);

        done();
      });
  });

  it('renders the layout for a given source with the parameters specified in the source', (done) => {
    Metalsmith(__dirname)
      .source('./src')
      .destination('./dist')
      .use(svelte({
        templates: `${__dirname}/templates`,
        base: `${__dirname}/layouts/base.html`
      }))
      .build((err, files) => {
        assert.ifError(err);

        const file = String(files['index.html'].contents);
        const $ = cheerio.load(file);

        assert.equal($('.post h1').text(), 'this is the title');
        assert.equal($('.post ul li').eq(0).text(), 'this is the foo');
        assert.equal($('.post ul li').eq(1).text(), 'this is the bar');
        assert.equal($('.post p').text(), 'This is the content');

        done();
      });
  });

  it('renders the markup into the base file contents', (done) => {
    Metalsmith(__dirname)
      .source('./src')
      .destination('./dist')
      .use(svelte({
        templates: `${__dirname}/templates`,
        base: `${__dirname}/layouts/base.html`
      }))
      .build((err, files) => {
        assert.ifError(err);

        const file = String(files['index.html'].contents);
        const $ = cheerio.load(file);

        assert.equal($('.body .post').length, 1);

        done();
      });
  });

  it('renders the markup into the base file contents with the site metadata', (done) => {
    Metalsmith(__dirname)
      .source('./src')
      .destination('./dist')
      .metadata({
        sitename: 'This is the site name'
      })
      .use(svelte({
        templates: `${__dirname}/templates`,
        base: `${__dirname}/layouts/base.html`
      }))
      .build((err, files) => {
        assert.ifError(err);

        const file = String(files['index.html'].contents);
        const $ = cheerio.load(file);

        assert.equal($('head title').text(), 'This is the site name');

        done();
      });
  });
});
