import Ember from 'ember';
import layout from '../templates/components/hyper-search';

const {
  Component,
  A: emberArray,
  RSVP: { Promise, resolve, reject },
  $: { ajax },
  run: { debounce, bind },
  get,
  set,
  isBlank,
  isPresent,
  typeOf
} = Ember;

/**
 * Returns the key for the query in the cache. Only works in conjunction with
 * Ember.get.
 *
 * @public
 * @param {String} query
 * @return {String} nested key name
 */
function keyForQuery(query) {
  return `_cache.${query}`;
}

export default Component.extend({
  layout,
  minQueryLength: 3,
  debounceRate: 0,
  endpoint: null,
  resultKey: null,

  init() {
    this._super(...arguments);
    this._cache = {};
    this.results = emberArray();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.removeAllFromCache();
  },

  cache(query, results) {
    set(this, keyForQuery(query), results);
    return resolve(results);
  },

  removeFromCache(query) {
    delete this._cache[query];
    this.notifyPropertyChange('_cache');
  },

  removeAllFromCache() {
    delete this._cache;
    set(this, '_cache', {});
  },

  clearResults() {
    get(this, 'results').clear();
    this.notifyPropertyChange('results');
  },

  fetch(query) {
    if (isBlank(query) || (query.length < get(this, 'minQueryLength'))) {
      return reject();
    }

    let cachedValue = get(this, keyForQuery(query));

    return isPresent(cachedValue) ? resolve(cachedValue) : this.requestAndCache(...arguments);
  },

  /**
   * Override to handle the fetching of data. Must return a `Promise`.
   *
   * @public
   * @method request
   * @param {String} query
   * @return {Promise}
   */
  request(query) {
    return new Promise((resolve, reject) => {
      ajax({
        dataType: 'json',
        method: 'GET',
        url: get(this, 'endpoint'),
        data: { q: query }
      })
      .then(resolve, reject);
    });
  },

  requestAndCache(query) {
    return this.request(query)
      .then((results) => this.cache(query, results))
      .catch((error) => reject(error));
  },

  _search(value = this.$('input').val()) {
    return this.fetch(value)
      .then(bind(this, this._setResults));
  },

  _setResults(results) {
    this._handleAction('handleResults', results);

    return set(this, 'results', results);
  },

  _handleAction(actionName, ...args) {
    if (this.attrs && typeOf(this.attrs[actionName]) === 'function') {
      this.attrs[actionName](...args);
    } else {
      this.sendAction(actionName, ...args);
    }
  },

  actions: {
    search(_event, query) {
      debounce(this, '_search', query, get(this, 'debounceRate'), true);
    },

    selectResult(result) {
      this._handleAction('selectResult', result);
    }
  }
});
