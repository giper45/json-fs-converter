const validUrl = require('valid-url');
const downloadUtil = require('download-file');
const _ = require('underscore');
const props = {}
const httpErrors = require('http-errors')
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path')
const urlUtils = require('url')

const download = function(url, options, cb) {
  const file = fs.createWriteStream(path.join(options.directory, options.filename));
  const parsedUrl = urlUtils.parse(url)
  let port;
  if (parsedUrl.port) {
    port = parsedUrl.port
  } else {
    port = parsedUrl.protocol == 'https:' ? 443 : 80;
  }
  const reqModule = parsedUrl.protocol == 'https:' ? https : http;
  const reqOptions = {
    hostname: parsedUrl.hostname,
    port: port,
    path: parsedUrl.path,
    method: 'GET',
    headers: {
    }
  };
  if (options.tokenJWT) {
    reqOptions.headers["Authorization"] = `Bearer ${options.tokenJWT}`;
  }
  const request = reqModule.get(reqOptions, function(response) {
  const body = '';
  if (response.statusCode == 404) {
    cb(new Error("Not found"))
  } else if (response.statusCode == 401) {
    cb(new Error("Not authorized"))
  } else if (response.statusCode !== 200) {
    cb(new Error("Invalid status code = " + response.statusCode))
  }
    // Ok response code 200
    else {
    response.pipe(file)
      file.on('finish', function() {
        file.close();  // close() is async, call cb after close completes.
        cb(null)
      });
    }
  }).on('error', (e) => {
    // fs.unlink(file); // Delete the file async. (But we don't check the result)
      cb(e);
    })
}

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
  if (props.tokenJWT) {
    options.tokenJWT = props.tokenJWT;
  }

  download(props.url, options, (err) => {
    if (err == null) {
      cb(null);
    } else {
      cb(err);
    }
      // if (err == "404") {
      // cb(new httpErrors(404, "File not found"));
    // }
    // else if (err == "401") {
      // cb(new httpErrors(401, "Not authorized"));
    // }
  });
}

function main(properties) {
  props.path = properties.path || '.';
  props.name = properties.name;
  props.url  = properties.url;
  if (properties.token_jwt) {
    props.tokenJWT = properties.token_jwt;
  }
  return {
    props,
    validate,
    run
  }
}

module.exports = main;
