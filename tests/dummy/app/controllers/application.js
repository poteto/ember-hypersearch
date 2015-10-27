import Ember from 'ember';

const { Controller, set } = Ember;

export default Controller.extend({
  selectedEmployee: null,
  results: null,

  actions: {
    selectResult(result) {
      set(this, 'selectedEmployee', result);
    },

    handleResults(results) {
      set(this, 'results', results);
    }
  }
});
