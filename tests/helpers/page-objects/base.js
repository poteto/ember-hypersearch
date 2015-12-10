export default class PageObject {
  constructor(assert, options) {
    this.assert = assert;
    this.options = options;
  }

  // finders
  findInputByName(name) {
    return findWithAssert(`input[name="${name}"]`);
  }

  findInputsWithErrors(errorSelector = '.has-error') {
    return findWithAssert(`input${errorSelector}`);
  }

  // assertions
  assertCurrentUrl(targetUrl = `/${this.options.routeName}`) {
    return this.then(() => {
      const currentUrl = currentURL();

      this.assert.equal(currentUrl, targetUrl, 'it redirects to the correct url');
    });
  }

  assertVisitUrl(targetUrl = `/${this.options.routeName}`) {
    visit(targetUrl);

    return this.assertCurrentUrl(targetUrl);
  }

  // interactions
  fillInByName(name, value) {
    return this.then(() => {
      const input = this.findInputByName(name);

      fillIn(input, value)
        .then(() => input.focusout());
    });
  }

  // utils
  /**
   * Pauses a test so you can look around within a PageObject chain.
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .login()
   *      .embiggen()
   *      .pause()
   *      .doStuff();
   *  });
   * ```
   * @public
   * @method pause
   * @param {Void}
   * @return {this}
   */
  pause() {
    return this.then(() => window.pauseTest());
  }

  /**
   * Embiggens the testing container for easier inspection.
   *
   * @public
   * @method embiggen
   * @param {String} testContainerId
   * @return {this}
   */
  embiggen(testContainerId = 'ember-testing-container') {
    return this.then(() => $(`#${testContainerId}`).css({ width: '100vw', height: '100vh' }));
  }

  /**
   * Throws a breakpoint via debugger within a PageObject chain.
   *
   * ```js
   *  test('foo', function(assert) {
   *    new SomePage(assert)
   *      .login()
   *      .debug()
   *      .doStuff();
   *  });
   * ```
   *
   * @public
   * @method debug
   * @param {Void}
   * @return {this}
   */
  debug() {
    // jshint ignore:start
    const poInstance = this; // deopt Babel so `this` is accessible
    return this.then((applicationInstance) => {
      console.info('Access the PageObject with `poInstance`, and the application instance with `applicationInstance`.');
      debugger;
      eval();
    });
    // jshint ignore:end
  }

  then(callback) {
    andThen(callback);
    return this;
  }
}
