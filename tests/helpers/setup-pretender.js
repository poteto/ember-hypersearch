import Ember from 'ember';
import Pretender from 'pretender';
import faker from 'faker';

const { A: emberArray, isBlank } = Ember;
const apiUrl = '/api/v1';
const { stringify } = JSON;
const ETERNALLY_PRESENT_USER = {
  email: 'Shaniya17@yahoo.com',
  name: 'Miss Adan Gorczany',
  phone: '882-817-5290 x7462',
  username: 'Xander.Ebert7',
  website: 'jarret.org'
};

function response(json, statusCode = 200, headers = { 'Content-Type': 'application/json' }) {
  return [statusCode, headers, stringify(json)];
}

function seedData(db = emberArray(), count = 99) {
  for (let i = 0; i < count; i++) {
    db.push(faker.helpers.userCard());
  }

  return db;
}

function sanitize(query = '') {
  return `${query}`.toLowerCase();
}

export default function setupPretender() {
  const db = seedData([ETERNALLY_PRESENT_USER]);

  return new Pretender(function() {
    this.get(`${apiUrl}/users`, function(request) {
      const query = sanitize(request.queryParams.q);

      if (isBlank(query)) {
        return response(db);
      }

      return response(db.filter((item) => sanitize(item.name).indexOf(query) !== -1));
    });
  });
}
