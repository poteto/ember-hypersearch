# ember-hypersearch :dash:
*Hyperspeed real-time search with caching*

[![npm version](https://badge.fury.io/js/ember-hypersearch.svg)](https://badge.fury.io/js/ember-hypersearch) [![Build Status](https://travis-ci.org/poteto/ember-hypersearch.svg)](https://travis-ci.org/poteto/ember-hypersearch)

Existing addons that implement real-time typeahead search assume that your app already has all the data. `ember-hypersearch` lets you query an endpoint directly, and caches results locally for better performance when the same query is repeated.

If you provide the addon with data, it will use that directly and does fuzzy search to find the item. 

## Compatibility

This addon is tested to work with Ember versions `1.13.x` and up. For versions < `2.0`, you will need to install the excellent `ember-get-helper` addon as well.

Because native `inputs` are used in this addon, you will need to provide your own template in order to use it on pre-Glimmer versions of Ember (basically anything below `1.13.x`). As this makes for poor testing ergonomics, we do not explicitly test for backwards compatibility please report any issues you might encounter to our [issue tracker](https://www.github.com/poteto/ember-hypersearch/issues).

## Usage

First, install the addon:

```sh
$ ember install ember-hypersearch
```

Then include the `hyper-search` component in a template of your choice:

```hbs
{{hyper-search
    endpoint="/api/v1/users"
    resultKey="email"
    selectResult=(action "selectResult")
    handleResults=(action "handleResults")
}}
```

The component can also be used in block form, if you pass it a template:

```hbs
{{#hyper-search
    endpoint="/api/v1/users"
    resultKey="name"
    selectResult=(action "selectResult") as |hypersearch|}}
  
  <form {{action "commit" on="submit"}}>
    {{one-way-input
        name="query" 
        type="text" 
        update=(action "search" target=hypersearch)
    }}
    <ul>
      {{#each hypersearch.results as |result|}}
        <li>
          <span {{action (action "selectResult") result on="click"}}>
            {{get result hypersearch.resultKey}}
          </span>
        </li>
      {{/each}}
    </ul>
    <button type="submit">Submit</button>
  </form>
{{/hyper-search}}
```

Note that this addon is designed to work with native inputs, so you will not need to use the `{{input}}` helper.

## Component API

### `minQueryLength: {Number}`

Default: `3`

The minimum length for a query before it fetches and returns results.

### `debounceRate: {Number}`

Default: `0`

If `> 0`, requests to your endpoint will be debounced to reduce the load on your API.

### `endpoint: {String}`

Default: `null`

The URL for your endpoint. By default, `hyper-search` will do a simple `GET` request with `q` as a query parameter. 

If your endpoint requires a different setup, you should reopen/extend the component and override the `request` method. For example:

```js
import HyperSearch from 'ember-hypersearch';

export default HyperSearch.reopen({
  request(query) {
    // Your AJAX request here
    // Must return a `Promise`
  }
});
```

### `resultKey: {String}`

Default: `null`

Results of the current query are displayed in a `ul` element below the `input`. If your result is an array of objects, you can optionally specify a key to display in the list of results.

### `selectResult: {Function|String}`

Default: `null`

If a closure action / action name is passed to the component, the action will receive the selected result.

### `handleResults: {Function|String}`

Default: `null`

If a closure action / action name is passed to the component, the action will receive the results of the query.

## Roadmap

Future versions will allow you to persist results locally via `localStorage` or some other storage method. For APIs with data that doesn't change often (e.g. addresses), this will allow for improved UX (search queries will appear to be instantaneous) and reduced load on the endpoint.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
