# postcss-vertical-rhythm [![Build Status][ci-img]][ci]
[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/markgoodyear/postcss-vertical-rhythm.svg?branch=master
[ci]:      https://travis-ci.org/markgoodyear/postcss-vertical-rhythm
A [PostCSS] plugin to create a custom vertical rhythm unit from the base font-size and line-height.

## Examples
Set the font on the body selector using the CSS shorthand method, you can use either `px`, `em`, `rem` or `%` unit for font-size:

```css
body {
  font: 16px/2 serif;
}
```

This will create a line-height of 32px, which will be the vertical rhythm value. Now you can use the custom vertical rhythm unit, `vr`:

Input:
```css
p {
  margin-bottom: 1vr;
  padding-top: .5vr;
}
```

Output:
```css
p {
  margin-bottom: 32px;
  padding-top: 16px;
}
```

## Options
Type: `Object | Null`

Default:
```js
{
  rootSelector: 'body',
}
```

- `rootSelector` (String) The root selector for the `font` declaraion.

## Usage
Install:
```
npm install postcss-vertical-rhythm --save-dev
```

Then include the plugin:
```js
postcss([ require('postcss-vertical-rhythm')(options) ])
```

See [PostCSS] docs for examples for your environment.

## Licence
Released under the MIT license.
