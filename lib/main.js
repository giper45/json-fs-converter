const _ = require('underscore');
const props = {}
const httpErrors = require('http-errors')

function validate() {
  // TODO: Invalid path
}

function run() {
}
function main(json = "") {
  const properties = JSON.parse(json);
  props.root = properties.root || '.';
  props.name = properties.name || 'base';
  props.structure = properties.structure || [];
  return {
    props,
    validate,
    run
  }
}

module.exports = main;
