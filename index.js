var postcss = require('postcss');
var spacingValue;

/**
 * Convert unit to unitless px value.
 * @param  {Number} value
 * @param  {String} unit
 * @return {Number}
 */
var toPx = function (value, unit) {
  if (unit === 'em' || unit === 'rem') {
    return parseFloat(value) * 16;

  } else if (unit === '%') {
    return parseFloat(value) / 100 * 16;
  }

  // This will be a px value, thanks to strict regex.
  return value;
};

/**
 * Calculate unitless px line-height based on font-size + line-height.
 * @param  {Array} fontProps
 * @return {Number}
 */
var calcLineHeight = function (fontProps) {
  var fontSize = fontProps[1];
  var fontUnit = fontProps[2];
  var lineHeight = fontProps[3];

  return toPx(fontSize, fontUnit) * lineHeight;
};

/**
 * Gets the font declaration properties.
 * @param  {String} declValue
 * @return {Array}
 */
var getProps = function (declValue) {

  // Matches {$1:font-size}{$2:unit}/{$3:line-height}.
  var fontProps = declValue.match(/(\d+|\d+?\.\d+)(r?em|px|%)(?:\s*\/\s*)(\d+|\d+?\.\d+)\s+/);

  // Make sure the line-height value is declared.
  if (!fontProps) {
    throw new Error('Font declaration is invalid. Make sure line-height is set.');
  }

  return fontProps;
};

/**
 * Gets the spacing value.
 * @param  {String} declValue
 * @return {Number}
 */
var getSpacingValue = function (declValue) {
  var val = parseFloat(declValue) || 1;

  return spacingValue * val;
};

module.exports = postcss.plugin('postcss-vertical-rhythm', function (opts) {
  opts = opts || {};
  var rootSelector = opts.rootSelector || 'body';
  var rhythmUnit = 'vr';

  return function (css) {
    css.eachDecl(function transformDecl (decl) {

      // Check for root font-size.
      if (decl.parent.selector === rootSelector) {
        if (decl.prop === 'font') {
          var props = getProps(decl.value);

          spacingValue = calcLineHeight(props);
        } else {
          throw new Error('font declaration not found in ' + rootSelector);
        }
      }

      // Calculate spacing value.
      if (decl.value.indexOf(rhythmUnit) !== -1) {
        decl.value = getSpacingValue(decl.value) + 'px';
      }
    });
  };
});
