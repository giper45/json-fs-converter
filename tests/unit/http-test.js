const describe = require('riteway').describe
const Try = require('riteway').Try
const httpDrive = require('../../lib/drivers/http.js')
const _ = require('underscore')
const fs = require('fs')
// const mock = require('mock-fs');
const crypto = require('crypto')
const httpErrors = require('http-errors')

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

const testChecksum = "8f3d5790a0d869f4199c2be7e45e4e8d";

const fakeTmp = '/faketmp';

// a function to test
const sum = (...args) => {
  if (args.some(v => Number.isNaN(v))) throw new TypeError('NaN');
  return args.reduce((acc, n) => acc + n, 0);
};

// mock({
//   fakeTmp: {
//   }
// })

rightTests = [
  {
    given: 'right properties',
    should :  'return true',
    props: {
      'name' : "test.txt",
      'url' : 'https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md'
    },
    expected : true
  }

]
errorsTest = [
  {
    given: 'properties without  name',
    should: 'throw',
    props: {
      'url' : 'https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md'
    },
    expected: new Error('Invalid properties - missing name')
  },
  {
    given: 'properties with empty name',
    should: 'throw',
    props: {
      'name' : "",
      'url' : 'https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md'
    },
    expected: new Error('Invalid properties - missing name')
  },
  {
    given: 'properties without url',
    should: 'throw',
    props: {
      'name' : "pippo",
    },
    expected: new Error('Invalid properties - missing url')
  },
  {
    given: 'properties with empty url',
    should: 'throw',
    props: {
      'name' : "pippo",
      'url' : ''
    },
    expected: new Error('Invalid properties - missing url')
  },
  {
    given: 'properties with wrong url',
    should: 'throw invalid url schema error',
    props: {
      'name' : "inva",
      'url' : 'blatete'
    },
    expected: new Error('Invalid url schema')
  }
  // TODO TEST PATH
  // {
  //   given: 'properties with invalid path',
  //   should: '',
  //   props: {
  //     'name' : "inva",
  //     'url' : 'blatete',
  //   },
  //   expected: new Error('Invalid url schema')
  // }
]

describe('properties()', async assert => {
  const props = {
      'name' : "test",
      'url' : 'https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md',
      'path' : fakeTmp
    };
  const hd = httpDrive(props);
    assert({
      given: 'right props',
      should: 'give right name',
      actual: hd.props.name,
      expected: "test"
    })
    assert({
      given: 'right props',
      should: 'give right url',
      actual: hd.props.url,
      expected: "https://raw.githubusercontent.com/giper45/DockerSecurityPlayground/master/Readme.md"
    })
    assert({
      given: 'right props',
      should: 'give right path',
      actual: hd.props.path,
      expected: fakeTmp
    })

});
describe('validate()', async assert => {
  _.each(rightTests, (t) => {
    const hd = httpDrive(t.props)
    assert({
      given: t.given,
      should: t.should,
      actual: hd.validate(),
      expected: t.expected
    })
  })
  _.each(errorsTest, (t) => {
    const hd = httpDrive(t.props)
    assert({
      given: t.given,
      should: t.should,
      actual: Try(hd.validate),
      expected: t.expected
    })
  })
});
