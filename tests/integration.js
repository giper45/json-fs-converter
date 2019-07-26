const tape = require('tape');
const mainModule = require('../lib/main.js');
const fakeTmp = '/fakeTmp';
const path = require('path');
const fs = require('fs');
const mock = require('mock-fs');
const complex = require('./json/complex.json')
const doubleFile = require('./json/simple.json');

const crypto = require('crypto')

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}


mock({
	'/fakeTmp' : {}
})

const md5Readme = "ad971c2a37865018024e06b173170b5c";
const md5License = "a23edc1ee920afaf17d00b438ea8ac71";
const md5Index = "5fb3fef6092c3fbc62162e9dbfc29d8d";

tape('create directory', (t) => {
	t.plan(2);
	const basic = '{"root" : "/fakeTmp", "name" : "basic-test", "structure" : [] } '
	const mm = mainModule(basic);

	mm.run((err) => {
		t.equal(err, null);
		const exists = fs.existsSync(path.join(fakeTmp, 'basic-test'));
		t.equal(exists, true);
	});
});

tape('create file inside dir with http driver', (t) => {
	t.plan(3);
	const singleFile = '{"root" : "/fakeTmp", "name" : "single-test", "structure" : [{"type": "http", "name" : "test.txt", "url": "https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md"}]}'
	const mm = mainModule(singleFile);
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp, 'single-test'));
		t.equal(exists, true);
		exists = fs.existsSync(path.join(fakeTmp, 'single-test', "test.txt"));
		t.equal(exists, true);
	})
})

tape('create 2 files and a directory with a file inside dir with http driver', (t) => {
	t.plan(8);
	// const doubleFile = '{"root" : "/fakeTmp", "name" : "double-test", "structure" : [{ "type": "http", "name" : "License.md", "url": "https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/License.md"}, {"type": "http", "name" : "Readme.md", "url": "https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md" }]}'
	const mm = mainModule(JSON.stringify(doubleFile));
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp, 'double-test'));
		t.equal(exists, true);
		const readmeFile = path.join(fakeTmp, 'double-test', "Readme.md")
		const licenseFile = path.join(fakeTmp, 'double-test', "License.md")
		exists = fs.existsSync(readmeFile);
		t.equal(exists, true);
		const readmeContent = fs.readFileSync(readmeFile);
		t.equal(md5Readme, checksum(readmeContent, "md5"));
		exists = fs.existsSync(licenseFile);
		t.equal(exists, true);
		const licenseContent = fs.readFileSync(licenseFile);
		t.equal(md5License, checksum(licenseContent));

		const internalFile = path.join(fakeTmp, 'double-test', 'internal', 'index.js');
		exists = fs.existsSync(internalFile);
		t.equal(exists, true);
		const indexContent = fs.readFileSync(internalFile);
		t.equal(md5Index, checksum(indexContent));

	})
});

tape('create complex directory', (t) => {
	t.plan(2);
	const mm = mainModule(JSON.stringify(complex));
	mm.run((err) => {
		t.equal(err, null);
		const exists = fs.existsSync(path.join(fakeTmp, 'dsp'));
		t.equal(exists, true);
	});
});

tape.onFinish(() => {
	mock.restore();
})
