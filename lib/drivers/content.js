const _ = require('underscore');
const props = {}
const path = require('path');
const fs = require('fs');


function validate() {
  // TODO: Invalid path
  if (!props.path) {
    throw new Error('Invalid properties - missing path')
  }
  if (!props.name) {
    throw new Error('Invalid properties - missing name')
  }
  if (!props.content) {
    throw new Error('Invalid properties - missing filepath')
  }
  return true;
  // throw new Error("Invalid url schema");
}

// Download a file
function run(cb) {
  // destination will be created or overwritten by default.
  fs.writeFile(path.join(props.path, props.name), props.content, cb)
}

function main(properties) {
  props.path = properties.path || '.';
  props.content = properties.content;
  props.name = properties.name;
  return {
    props,
    validate,
    run
  }
}

module.exports = main;
