const assert = require('assert');

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base.js')
  it('entry', () => {
    assert.strictEqual(baseConfig.entry.index, 'D:/ghj/builder-webpack/test/smoke/template/src/index/index.js')
    assert.strictEqual(baseConfig.entry.search, 'D:/ghj/builder-webpack/test/smoke/template/src/search/index.js')
  })
})