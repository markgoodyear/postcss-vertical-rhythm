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

  // Make sure font delcaration is valid.
  if (!fontProps) {
    throw decl.error('Font declaration is invalid.');
  }

  return fontProps;
};

/**
 * Gets the rhythm value.
 * @param  {Number} declValue
 * @return {Number}
 */
var getRhythmValue = function (declValue, rhythmValue) {
  var val = parseFloat(declValue) || 1;

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
        }
      }

      // Calculate ryhthm value.
      if (decl.value.indexOf(rhythmUnit) !== -1) {

        // Use new RegExp to capture var
        var regexp = new RegExp('(\\d*\\.?\\d+)' + rhythmUnit, 'gi');

        // Replace each vr unit value in the decl.value, e.g. shorthand properties.
        decl.value = decl.value.replace(regexp, function ($1) {
          return getRhythmValue($1, rhythmValue) + 'px';
        });
      }
    });
  };
});
