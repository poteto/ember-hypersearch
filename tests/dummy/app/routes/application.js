import Ember from 'ember';

const {
  RSVP: { Promise },
  $: { getJSON },
  A: emberArray,
  Route,
  set,
} = Ember;

export default Route.extend({
  model() {
    return new Promise((resolve, reject) => {
      getJSON('/api/v1/users').then((results) => resolve(emberArray(results)), reject);
    });
  },

  actions: {
    selectResult(result) {
      set(this, 'controller.selectedEmployee', result);
    }
  }
});
