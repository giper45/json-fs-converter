const _ = require('underscore');
const props = {}
const httpErrors = require('http-errors')
const path = require('path');
const fs = require('fs');
const httpDriver = require('./drivers/http.js');
const async = require('async');

function _manageStructure(basePath, structure, cb) {
	async.eachSeries(structure, (element, c) => {
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
	structure.path = basePath;
	switch (structure.type) {
		case 'http' :
			driver = httpDriver(structure);
			break;
		default:
			cb(new Error("Driver not existent"));
			break;
	}
	driver.run(cb);
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
function main(json = "") {
	const properties = JSON.parse(json);
	props.root = properties.root || '.';
	props.name = properties.name || 'base';
	props.structure = properties.structure || [];
	return {
		props,
		createFile,
		run
	}
}

module.exports = main;
