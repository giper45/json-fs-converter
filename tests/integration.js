const tape = require('tape');
const mainModule = require('../lib/main.js');
const fakeTmp = '/fakeTmp';
const fakeTmp2 = '/fakeTmp2';
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
  md5: "29dac8a4e648a1bd707448d5af195239"
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
	'/fakeTmp' : {},
	'/fakeTmp2' : {}
})

const md5Readme = "ad971c2a37865018024e06b173170b5c";
const md5License = "a23edc1ee920afaf17d00b438ea8ac71";
const md5Index = "8e6cf2f8c5df4df2f0147fe2b8067e28";

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
      console.log(f.path);
      t.equal(exists, true);
      fileContent = fs.readFileSync(f.path);
      t.equal(f.md5, checksum(fileContent))

    })
	});
})

tape('create 2 files and a directory with a file inside dir with fs driver', (t) => {
	t.plan(6);
    const testmd = "be5e16c3d540fc30371e3af977e2a62e";
    const imagemd = "bee1c0f53d40e56f04a84dda46bbfbdb";
	 const fsFile = '{"root" : "/fakeTmp", "name" : "testfs", "structure" : [{ "type": "fs", "name" : "test.txt", "filepath": "/fakeTmp/test.txt"}, {"type": "fs", "name" : "testimage.png", "filepath": "/fakeTmp/test2.txt" }]}'
  fs.writeFileSync(path.join("/fakeTmp", "test.txt"),  "thisisatest")
  fs.writeFileSync(path.join("/fakeTmp", "test2.txt"),  "anothertest")
	const mm = mainModule(fsFile);
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp, 'testfs'));
		t.equal(exists, true);
		const testFile = path.join(fakeTmp, 'testfs', "test.txt")
		const imageFile = path.join(fakeTmp, 'testfs', "testimage.png")
		exists = fs.existsSync(testFile);
		t.equal(exists, true);
		const testContent = fs.readFileSync(testFile);
		t.equal(testmd, checksum(testFile, "md5"));
		exists = fs.existsSync(imageFile);
		t.equal(exists, true);
		const imageContent = fs.readFileSync(imageFile);
		t.equal(imagemd, checksum(imageContent));
	})
});

tape('create 2 files and a directory with a file inside dir with content driver', (t) => {
	t.plan(6);
	 const fsFile = '{"root" : "/fakeTmp2", "name" : "testfs", "structure" : [{ "type": "content", "name" : "test.txt", "content": "one"}, {"type": "content", "name" : "testimage.png", "content": "two" }]}'
	const mm = mainModule(fsFile);
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp2, 'testfs'));
		t.equal(exists, true);
		const testFile = path.join(fakeTmp2, 'testfs', "test.txt")
		const imageFile = path.join(fakeTmp2, 'testfs', "testimage.png")
		exists = fs.existsSync(testFile);
		t.equal(exists, true);
		const testContent = fs.readFileSync(testFile);
		t.equal(testContent.toString(), "one");
		exists = fs.existsSync(imageFile);
		t.equal(exists, true);
		const imageContent = fs.readFileSync(imageFile);
		t.equal(imageContent.toString(), "two");
	})
});


tape.onFinish(() => {
	mock.restore();
})
