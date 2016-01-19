const assert = require('assert');
const helper = require('../helpers.js')

describe('if the helper is called', function () {

  it('exists', function () {
    assert(helper)
  })

  it('can generate a url hash', function () {
    const a = helper.urlHash()
    const b = helper.urlHash()

    assert.notEqual(helper.urlHash(), 'hello')
    assert.notEqual(helper.urlHash(), 'normal string')
    assert.notEqual(a, b)
  })

  it('can create a valid url', function () {
    const req = {
      protocol: 'http',
      originalUrl: 'admin',
      get: (host) => { return 'localhost'}
    }

    assert(helper.liveUrlGen(req))
    assert.equal(helper.liveUrlGen(req), 'http://localhost/live_poll')
  })

  it('can generate a live url', function () {
    const req = {
      protocol: 'http',
      originalUrl: '/admin',
      get: (host) => { return 'localhost'}
    }

    assert(helper.urlGen(req))
    assert.equal(helper.urlGen(req), 'http://localhost/admin')
  })

})
