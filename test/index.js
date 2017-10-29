'use strict';

const assert = require('assert');
const Metalsmith = require('metalsmith');
const cheerio = require('cheerio');
const svelte = require('../');

function runMetalsmithWithPlugin(options, cb) {
  Metalsmith(__dirname)
    .metadata({ sitename: 'This is the site name' })
    .source('./src')
    .destination('./dist')
    .use(svelte(options))
    .build(cb);
}

function getFileContents({ contents }) {
  const file = String(contents);
  return cheerio.load(file);
}

describe('Metalsmith Svelte templates', () => {
  describe('plugin options', () => {
    it('throws an error when { templates } has not been specified', (done) => {
      runMetalsmithWithPlugin(
        { base: `${__dirname}/layouts/base.html` },
        (err, files) => {
          assert.ok(err);
          assert.equal(err.message, 'You must specify "templates"');
          assert.ifError(files);

          done();
        }
      );
    });

    it('throws an error when { base } has not been specified', (done) => {
      runMetalsmithWithPlugin(
        { templates: `${__dirname}/templates` },
        (err, files) => {
          assert.ok(err);
          assert.equal(err.message, 'You must specify "base"');
          assert.ifError(files);

          done();
        }
      );
    });

    it('renders the correct number of files based on the contents of the source directory', (done) => {
      runMetalsmithWithPlugin(
        {
          templates: `${__dirname}/templates`,
          base: `${__dirname}/layouts/base.html`
        },
        (err, files) => {
          assert.ifError(err);

          assert.equal(Object.keys(files).length, 2);
          assert(files['index.html']);
          assert(files['foo/index.html']);

          done();
        }
      );
    });

    it('renders the markup into the base file contents', (done) => {
      runMetalsmithWithPlugin(
        {
          templates: `${__dirname}/templates`,
          base: `${__dirname}/layouts/base.html`
        },
        (err, files) => {
          assert.ifError(err);

          const $ = getFileContents(files['index.html']);

          assert.equal($('.body .post').length, 1);

          done();
        }
      );
    });
  });

  describe('metalsmith metadata', () => {
    it('renders the markup into the base file contents with the site metadata', (done) => {
      runMetalsmithWithPlugin(
        {
          templates: `${__dirname}/templates`,
          base: `${__dirname}/layouts/base.html`
        },
        (err, files) => {
          assert.ifError(err);

          const $ = getFileContents(files['index.html']);

          assert.equal($('head title').text(), 'This is the site name');

          done();
        }
      );
    });
  });

  describe('template options', () => {
    describe('layout', () => {
      it('renders the layout for a given source with the parameters specified in the source', (done) => {
        runMetalsmithWithPlugin(
          {
            templates: `${__dirname}/templates`,
            base: `${__dirname}/layouts/base.html`
          },
          (err, files) => {
            assert.ifError(err);

            const $ = getFileContents(files['index.html']);

            assert.equal($('.post h1').text(), 'this is the title');
            assert.equal($('.post ul li').eq(0).text(), 'this is the foo');
            assert.equal($('.post ul li').eq(1).text(), 'this is the bar');
            assert.equal($('.post p').text(), 'This is the content');

            done();
          }
        );
      });
    });

    describe('inlineCSS', () => {
      it('does not inline CSS for a given source when the "inlineCSS" option is not set', (done) => {
        runMetalsmithWithPlugin(
          {
            templates: `${__dirname}/templates`,
            base: `${__dirname}/layouts/base.html`
          },
          (err, files) => {
            assert.ifError(err);

            const $ = getFileContents(files['index.html']);

            assert.equal($('head #svelte-inline-css').length, 0);

            done();
          }
        );
      });

      it('inlines CSS for a given source when that contains the "inlineCSS" option', (done) => {
        runMetalsmithWithPlugin(
          {
            templates: `${__dirname}/templates`,
            base: `${__dirname}/layouts/base.html`
          },
          (err, files) => {
            assert.ifError(err);

            const $ = getFileContents(files['foo/index.html']);

            assert.equal(
              $('head #svelte-inline-css').html(),
              '[svelte-4180458796].post,[svelte-4180458796] .post{border:0;background:none;color:#000}'
            );

            done();
          }
        );
      });
    })
  })
});
