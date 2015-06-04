var postcss = require('postcss');
var expect  = require('chai').expect;
var plugin = require('../');

var css = function (selector, size, unit) {
  return selector + '{font:' + size + ' serif;} p { margin-botom:' + unit + ';}';
};

var test = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input).then(function (result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-vertical-ryhthm', function () {

  describe('1vr should equal 32px', function () {

    it('from 16px/2', function (done) {
      test(css('body', '16px/2', '1vr'), css('body', '16px/2', '32px'), { }, done);
    });

    it('from 1em/2', function (done) {
      test(css('body', '1em/2', '1vr'), css('body', '1em/2', '32px'), { }, done);
    });

    it('from 1rem/2', function (done) {
      test(css('body', '1rem/2', '1vr'), css('body', '1rem/2', '32px'), { }, done);
    });

    it('from 100%/2', function (done) {
      test(css('body', '100%/2', '1vr'), css('body', '100%/2', '32px'), { }, done);
    });
  });

  describe('.5vr should equal 16px', function () {

    it('from 16px/2', function (done) {
      test(css('body', '16px/2', '.5vr'), css('body', '16px/2', '16px'), { }, done);
    });

    it('from 1em/2', function (done) {
      test(css('body', '1em/2', '.5vr'), css('body', '1em/2', '16px'), { }, done);
    });

    it('from 1rem/2', function (done) {
      test(css('body', '1rem/2', '.5vr'), css('body', '1rem/2', '16px'), { }, done);
    });

    it('from 100%/2', function (done) {
      test(css('body', '100%/2', '.5vr'), css('body', '100%/2', '16px'), { }, done);
    });
  });

  describe('options', function () {
    it('rootSelector', function (done) {
      test(css('html', '16px/2', '1vr'), css('html', '16px/2', '32px'), { rootSelector: 'html' }, done);
    });
  });
});
