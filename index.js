var postcss = require('postcss');

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
 * @param  {Object} decl
 * @return {Array}
 */
var getProps = function (decl) {

  // Matches {$1:font-size}{$2:unit}/{$3:line-height}.
  var fontProps = decl.value.match(/(\d+|\d+?\.\d+)(r?em|px|%)(?:\s*\/\s*)(\d+|\d+?\.\d+)\s+/);

  // Make sure the line-height value is declared.
  if (!fontProps) {
    throw decl.error('Font declaration is invalid. Make sure line-height is set.');
  }

  return fontProps;
};

/**
 * Gets the rhythm value.
 * @param  {Object} decl
 * @return {Number}
 */
var getRhythmValue = function (decl, rhythmValue) {
  var val = parseFloat(decl.value) || 1;

  return rhythmValue * val;
};

module.exports = postcss.plugin('postcss-vertical-rhythm', function (opts) {
  opts = opts || {};
  var rootSelector = opts.rootSelector || 'body';
  var rhythmUnit = 'vr';
  var rhythmValue;

  return function (css) {
    css.eachDecl(function transformDecl (decl) {

      // Check for root font-size.
      if (decl.parent.selector === rootSelector) {
        if (decl.prop === 'font') {
          var props = getProps(decl);

          rhythmValue = calcLineHeight(props);
        } else {
          throw decl.error('Font declaration not found in ' + rootSelector);
        }
      }

      // Calculate ryhthm value.
      if (decl.value.indexOf(rhythmUnit) !== -1) {
        decl.value = getRhythmValue(decl, rhythmValue) + 'px';
      }
    });
  };
});
