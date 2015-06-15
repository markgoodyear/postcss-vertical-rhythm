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

  describe('multiple root selectors', function () {
    it('one font declaration', function (done) {
      test(
        'body { color: #333; } body { font: 16px/2 serif } p { margin-botom: 1vr }',
        'body { color: #333; } body { font: 16px/2 serif } p { margin-botom: 32px }',
        { },
        done
      );
    });

    it('two font declarations, the latter takes precidence', function (done) {
      test(
        'body { color: #333; font: 16px/2 serif } body { font: 16px/1 serif } p { margin-botom: 1vr }',
        'body { color: #333; font: 16px/2 serif } body { font: 16px/1 serif } p { margin-botom: 16px }',
        { },
        done
      );
    });
  });

  describe('shorthand declarations', function () {
    it('one value', function (done) {
      test(
        'body { font: 16px/2 serif } p { margin: 1vr }',
        'body { font: 16px/2 serif } p { margin: 32px }',
        { },
        done
      );
    });

    it('two values', function (done) {
      test(
        'body { font: 16px/2 serif } p { margin: 1vr 2vr }',
        'body { font: 16px/2 serif } p { margin: 32px 64px }',
        { },
        done
      );
    });

    it('three values', function (done) {
      test(
        'body { font: 16px/2 serif } p { margin: 1vr 2vr 3vr }',
        'body { font: 16px/2 serif } p { margin: 32px 64px 96px }',
        { },
        done
      );
    });

    it('four values', function (done) {
      test(
        'body { font: 16px/2 serif } p { margin: 1vr 2vr 3vr 4vr }',
        'body { font: 16px/2 serif } p { margin: 32px 64px 96px 128px }',
        { },
        done
      );
    });

    it('mixed units', function (done) {
      test(
        'body { font: 16px/2 serif } p { margin: 1vr 10px .5vr 0 }',
        'body { font: 16px/2 serif } p { margin: 32px 10px 16px 0 }',
        { },
        done
      );
    });
  });

  describe('options', function () {
    it('rootSelector change', function (done) {
      test(css('html', '16px/2', '1vr'), css('html', '16px/2', '32px'), { rootSelector: 'html' }, done);
    });
  });
});
