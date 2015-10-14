import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import setupPretender from './setup-pretender';

const { merge, run } = Ember;

export default function startApp(attrs) {
  let application;
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  run(() => {
    Application.reopen({
      init() {
        this._super(...arguments);
        this.server = setupPretender();
      },

      willDestroy() {
        this._super(...arguments);
        this.server.shutdown();
      }
    });

    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
