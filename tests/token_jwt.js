const tape = require('tape');
const spawn = require('child_process');
const fakeTmp = '/fakeTmp';
const mainModule = require('../lib/main.js');
const path = require('path');
const mock = require('mock-fs');
const fs = require('fs');

mock({
  '/fakeTmp' : {},
})

tape('[HTTP_DRIVER] should be not authorized jwt', (t) => {
	t.plan(1);
	const singleFile = '{"root" : "/fakeTmp", "name" : "single-test-error", "structure" : [{"type": "http", "name" : "test.txt", "url": "http://localhost:8080/org1/repo1/index.yaml"}]}';

	const mm = mainModule(singleFile);
	mm.run((err) => {
		t.equal(err.message, new Error("Not authorized").message);
		// let exists = fs.existsSync(path.join(fakeTmp, 'single-test'));
		// t.equal(exists, true);
		// exists = fs.existsSync(path.join(fakeTmp, 'single-test', "test.txt"));
		// t.equal(exists, true);
	});
})

tape('[HTTP_DRIVER] create file by using token jwt', (t) => {
	t.plan(3);
  const tokenJWT = spawn.execSync(path.join("tests", 'req_token.sh'))
  const accessToken = JSON.parse(tokenJWT);

	const singleFile = '{"root" : "/fakeTmp", "name" : "single-test", "structure" : [{"type": "http", "name" : "test.txt", "url": "http://localhost:8080/org1/repo1/index.yaml", "token_jwt": "'+accessToken.access_token+'"}]}'

	const mm = mainModule(singleFile);
	mm.run((err) => {
		t.equal(err, null);
		let exists = fs.existsSync(path.join(fakeTmp, 'single-test'));
		t.equal(exists, true);
		exists = fs.existsSync(path.join(fakeTmp, 'single-test', "test.txt"));
		const  content  = fs.readFileSync(path.join(fakeTmp, 'single-test', "test.txt"));
		t.equal(exists, true);
	});
})
