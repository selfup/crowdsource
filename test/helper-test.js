const assert = require('assert');
const helper = require('../helpers.js')

describe('if the helper is called', function () {

  const req = {
    protocol: 'http',
    originalUrl: '/admin',
    get: (host) => { return 'localhost'}
  }

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

  it('can create a live_poll url', function () {
    assert(helper.liveUrlGen(req))
    assert.equal(helper.liveUrlGen(req), 'http://localhost/live_poll')
  })

  it('can generate an admin url', function () {
    assert(helper.urlGen(req))
    assert.equal(helper.urlGen(req), 'http://localhost/admin')
  })

  it('can generate an admin url', function () {
    assert(helper.feedbackUrlGen(req))
    assert.equal(helper.feedbackUrlGen(req), 'http://localhost/live_feedback_vote')
  })
})
