import Ember from 'ember';

const {
  RSVP: { Promise },
  $: { getJSON },
  A: emberArray,
  Route
} = Ember;

export default Route.extend({
  model() {
    return new Promise((resolve, reject) => {
      getJSON('/api/v1/users').then((results) => resolve(emberArray(results)), reject);
    });
  }
});
