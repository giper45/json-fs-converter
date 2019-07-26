const tape = require('tape');
const mainModule = require('../lib/main.js');
const fakeTmp = '/fakeTmp';
const path = require('path');
const fs = require('fs');
const mock = require('mock-fs');
const complex = require('./json/complex.json')
const doubleFile = require('./json/simple.json');
const _ = require('underscore');

const crypto = require('crypto')
const rootPath = path.join("/fakeTmp", "dsp")

const arrayFiles = [
{
  path: path.join(rootPath, "CHANGELOG.md"),
  md5: "c61fddb8cc0c61298481e25c53bdf73b"
},
{
  path: path.join(rootPath, "License.md"),
  md5: "a23edc1ee920afaf17d00b438ea8ac71"
},
{
  path: path.join(rootPath, "Readme.md"),
  md5: "ad971c2a37865018024e06b173170b5c"
},
{
  path: path.join(rootPath, "config", "backup_configuser.json"),
  md5: "569ab1b2802e1643796f6cc9efb1e7d2"
},
{
  path: path.join(rootPath, "config", "local.config.json"),
  md5: "fac1059dd91bc6fc03e2a9072b9c3795"
},
{
  path: path.join(rootPath, "config", "test_user.json"),
  md5: "e37ad27cef3261bff2fc31d84d65e263"
},
{
  path: path.join(rootPath, "config", "tpl_local.config.json"),
  md5: "5e21893f388498eef8a857c3a8bfa8e6"
}
]

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
	t.plan(16);
	const mm = mainModule(JSON.stringify(complex));
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp, 'dsp'));
    let fileContent = "";
		t.equal(exists, true);
    _.each(arrayFiles, (f) => {
      exists = fs.existsSync(f.path);
      t.equal(exists, true);
      fileContent = fs.readFileSync(f.path);
      t.equal(checksum(fileContent), f.md5);

    })
	});
});

tape.onFinish(() => {
	mock.restore();
})
