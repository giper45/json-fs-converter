const describe = require('riteway').describe
const mainModule = require('../../lib/main.js')


describe('basic test', async assert => {
  const basic = '{"root" : "/fakeTmp", "name" : "basic-test", "structure" : [] } '
  const mm = mainModule(basic);
  assert({
    given: 'Basic test',
    should: 'Contain basic property',
    actual: mm.props.root,
    expected: "/fakeTmp"
  })
  assert({
    given: 'Basic test',
    should: 'Contain basic name',
    actual: mm.props.name,
    expected: "basic-test"
  })
  assert({
    given: 'Basic test',
    should: 'Contain basic structure',
    actual: mm.props.structure,
    expected: []
  })
})
