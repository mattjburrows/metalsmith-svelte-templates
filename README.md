# metalsmith-svelte-templates

## Install

`npm i --save metalsmith-svelte-templates`

## Usage

### API
```js
Metalsmith(__dirname)
  .use(svelte({
    templates: './templates'
    base: './layouts/base.html'
  }))
  .build((err) => {
    if (err) throw err;
  });
```

### Template
```html
---
layout: post.html
inlineCSS: true
{{key}}: {{value}}
---

<p>This is the contents</p>
```
#### Template options
- `layout` - required - Filename of the template to use. These are housed within the [Options](#options) `templates` directory.
- `inlineCSS` - optional - Specifies whether you want to inline CSS into the base template. You will need to include the `inlineCSS` template key in your base file in order to print out the inline styles.
- `data` - optional - Extra data that gets passed to the svelte component, format `foo: bar`.
- `contents` - required - Contents that gets added to the layout.

## Options

- `templates` - required - Path to directory containing your templates.
- `base` - required - Path to your base file.
