import { test } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import setupPretender from '../helpers/setup-pretender';
import MainPO from '../../tests/helpers/page-objects/main';

moduleForAcceptance('Acceptance | main', {
  beforeEach() {
    this.server = setupPretender();
  },

  afterEach() {
    this.server.shutdown();
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

test('it handles results', function(assert) {
  return new MainPO(assert, { routeName: '/' })
    .assertVisitUrl()
    .searchForUserByName('component-inline', 'Miss Adan Gorczany')
    .assertClosureActionResultsLength('component-inline', 1);
});

