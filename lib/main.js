const _ = require('underscore');
const props = {}
const httpErrors = require('http-errors')
const path = require('path');
const fs = require('fs');
const contentDriver = require('./drivers/content.js');
const httpDriver = require('./drivers/http.js');
const fsDriver = require('./drivers/fs.js');
const async = require('async');

// TBD Insert witelist of available paths
function _manageStructure(basePath, structure, cb) {
  // if the input is JSON string convert the structure
  if (typeof structure == "string") {
    structure = JSON.parse(structure);
  }
  async.eachSeries(structure, (element, c) => {
    if (typeof element == "string") {
      element = JSON.parse(element);
    }
    // If it is a directory call create Dir
    if (element.type == 'directory') {
      createDir(basePath, element, c);
    } else {
      // Else create a file
      createFile(basePath, element, c)
    }
  }, cb);
}

function createDir(originalPath, structure, callback) {
  const basePath = path.join(originalPath, structure.name);
  async.waterfall([
    (cb) => fs.mkdir(basePath, cb),
    (cb) => _manageStructure(basePath, structure.contents, cb)
  ], (err) => {
    callback(err)
  })
}

function createFile(basePath, structure, cb) {
  let driver;
  let err = null
  // if the input is JSON string convert the structure
  if (typeof structure == "string") {
    structure = JSON.parse(structure);
  }
  structure.path = basePath;
  switch (structure.type) {
    case 'http' :
      driver = httpDriver(structure);
      break;
    case 'fs' :
      driver = fsDriver(structure);
      break;
    case 'content' :
      driver = contentDriver(structure);
      break;
    default:
      err = new Error("Driver not existent");
      break;
  }
  if (err) {
    cb(err);
  } else {
    driver.run(cb);
  }
}


function run(callback) {
  const rootDir = path.join(props.root, props.name);
  async.waterfall([
    // Create root directory
    (cb) => fs.mkdir(rootDir, cb),
    // Recursive call
    (cb) => _manageStructure(rootDir, props.structure, cb)
  ],(err) => {
    callback(err);
  });
}

function promiseRun() {
  return new Promise((resolve, reject) => {
    run((err) => {
      if (err == null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

function main(json = "") {
  const properties = JSON.parse(json);
  props.root = properties.root || '.';
  props.name = properties.name || 'base';
  props.structure = properties.structure || [];
  return {
    props,
    createFile,
    run,
    promiseRun
  }
}

module.exports = main;
