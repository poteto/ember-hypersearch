import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import MainPO from '../../tests/helpers/page-objects/main';

const { run } = Ember;

module('Acceptance | main', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    run(this.application, 'destroy');
  }
});

test('it renders results', function(assert) {
  return new MainPO(assert, { routeName: '/' })
    .assertVisitUrl()
    .searchForUserByName('component-block', 'a')
    .assertResultLength('component-block', 1);
});

test('it handles selecting results', function(assert) {
  return new MainPO(assert, { routeName: '/' })
    .assertVisitUrl()
    .searchForUserByName('component-block', 'a')
    .selectFirstResult()
    .assertEmployeeOfTheDay();
});

test('it does not search if the query is shorter than the `minQueryLength`', function(assert) {
  return new MainPO(assert, { routeName: '/' })
    .assertVisitUrl()
    .searchForUserByName('component-inline', 'a')
    .assertResultLength('component-inline', 0);
});

test('it accepts a `resultKey`', function(assert) {
  return new MainPO(assert, { routeName: '/' })
    .assertVisitUrl()
    .searchForUserByName('component-inline', 'Miss Adan Gorczany')
    .assertResultLength('component-inline', 1);
});
