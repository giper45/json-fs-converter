const validUrl = require('valid-url');
const downloadUtil = require('download-file');
const _ = require('underscore');
const props = {}
const httpErrors = require('http-errors')

function validate() {
  // TODO: Invalid path
  if (!props.path) {
    throw new Error('Invalid properties - missing path')
  }
  if (!props.name) {
    throw new Error('Invalid properties - missing name')
  }
  if (!props.url) {
    throw new Error('Invalid properties - missing url')
  }
  if (validUrl.isUri(props.url)) {
    return true;
  }
    throw new Error("Invalid url schema");
}

// Download a file
function run(cb) {
  const options = {
    directory : props.path,
    filename: props.name
  }
  downloadUtil(props.url, options, (err) => {
    if (err == false) {
      cb(null);
    } else if (err == "404") {
      cb(new httpErrors(404, "File not found"));
    }
  });
}
function main(properties) {
  props.path = properties.path || '.';
  props.name = properties.name;
  props.url  = properties.url;
  return {
    props,
    validate,
    run
  }
}

module.exports = main;
