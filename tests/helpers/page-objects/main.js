import PageObject from './base';

export default class MainPO extends PageObject {
  constructor() {
    super(...arguments);
  }

  searchForUserByName(id, value) {
    return this.then(() => {
      const input = findWithAssert(`#${id} input`);
      fillIn(input, value).then(() => input.focusout());
    });
  }

  selectFirstResult() {
    return this.then(() => {
      click('.hypersearch-result:first-of-type span');
    });
  }

  assertResultLength(id, expectedLength) {
    return this.then(() => {
      this.assert.ok(find(`#${id} .hypersearch-results li`).length >= expectedLength, `it displays ${expectedLength} results`);
    });
  }

  assertClosureActionResultsLength(expectedLength) {
    return this.then(() => {
      this.assert.ok(find(`.inline-results-length:contains("${expectedLength}")`), `it displays ${expectedLength} results from the closure action`);
    });
  }

  assertEmployeeOfTheDay() {
    return this.then(() => {
      this.assert.ok(findWithAssert('#eotd'), 'it displays the selected result');
      this.assert.ok(findWithAssert('marquee'), 'it displays the selected result');
    });
  }
}
