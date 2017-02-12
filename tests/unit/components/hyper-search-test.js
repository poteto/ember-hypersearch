import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox;
const {
  RSVP: { resolve },
  run: { later },
  get,
  run
} = Ember;

moduleForComponent('hyper-search', 'Unit | Component | hyper search', {
  unit: true,
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('#requestAndCache caches queries and their results', function(assert) {
  const component = this.subject({ endpoint: '/' });
  // no need to actually do an ajax request
  sandbox.stub(component, 'request', resolve);

  return component.requestAndCache('foo')
    .then((results) => {
      assert.equal(results, 'foo', 'should return results');
      assert.equal(get(component, '_cache.foo'), 'foo', 'should return and cache results');
    });
});

test('#requestAndCache caches queries with periods', function(assert) {
  const component = this.subject({ endpoint: '/' });
  // no need to actually do an ajax request
  sandbox.stub(component, 'request', resolve);

  return component.requestAndCache('pizza@party.com')
    .then((results) => {
      assert.equal(results, 'pizza@party.com', 'should return results');
      assert.equal(get(component, '_cache.pizza@party-com'), 'pizza@party.com', 'should return and cache results');
    });
});

test('#requestAndCache caches queries with more than one period', function(assert) {
  const component = this.subject({ endpoint: '/' });
  // no need to actually do an ajax request
  sandbox.stub(component, 'request', resolve);

  return component.requestAndCache('lots.of.periods')
    .then((results) => {
      assert.equal(results, 'lots.of.periods', 'should return results');
      assert.equal(get(component, '_cache.lots-of-periods'), 'lots.of.periods', 'should return and cache results');
    });
});

test('#removeFromCache removes a result from the cache', function(assert) {
  const expectedResult = { poo: '💩' };
  const component = this.subject({ endpoint: '/' });

  run(() => {
    component.set('_cache', {
      foo: 'foo',
      poo: '💩'
    });
    component.removeFromCache('foo');
    assert.deepEqual(get(component, '_cache'), expectedResult, 'should remove the cached result');
  });
});

test('#removeFromCache removes a result with period from cache', function(assert) {
  const expectedResult = { poo: '💩' };
  const component = this.subject({ endpoint: '/' });

  run(() => {
    component.set('_cache', {
      'foo-zle': 'foo',
      poo: '💩'
    });
    component.removeFromCache('foo.zle');
    assert.deepEqual(get(component, '_cache'), expectedResult, 'should remove the cached result');
  });
});

test('#removeFromCache removes a result with multiple periods from cache', function(assert) {
  const expectedResult = { poo: '💩' };
  const component = this.subject({ endpoint: '/' });

  run(() => {
    component.set('_cache', {
      'lots-of-periods': 'foo',
      poo: '💩'
    });
    component.removeFromCache('lots-of-periods');
    assert.deepEqual(get(component, '_cache'), expectedResult, 'should remove the cached result');
  });
});
test('#removeAllFromCache removes all results from the cache', function(assert) {
  const expectedResult = {};
  const component = this.subject({
    endpoint: '/',
    _cache: {
      foo: 'foo',
      poo: '💩'
    }
  });

  component.removeAllFromCache();
  assert.deepEqual(get(component, '_cache'), expectedResult, 'should remove all cached results');
});

test('#actions#search debounces the search', function(assert) {
  const done = assert.async();
  const expectedResult = { foo: 'foo', poo: 'poo' };
  const component = this.subject({
    endpoint: '/',
    debounceRate: 5
  });
  sandbox.stub(component, 'request', resolve);

  component.send('search', null, 'foo'); // first call is not debounced
  assert.deepEqual(get(component, '_cache'), { foo: 'foo' }, 'should return result immediately on first query');

  later(this, () => {
    component.send('search', null, 'poo');
  }, get(component, 'debounceRate') + 1);

  later(this, () => {
    assert.deepEqual(get(component, '_cache'), expectedResult, 'should debounce');
    done();
  }, get(component, 'debounceRate') + 2);
});
