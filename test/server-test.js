const assert = require('assert')
const request = require('request')
const app = require('../index')

describe('Server', function() {
  before(function(done) {
    this.port = 9000
    this.server = app.listen(this.port, function(error, result) {
      if (error) {return done(error) }
      done()
    })
    this.request = request.defaults({
      baseUrl: 'http://localhost:9000/'
    })
  })

  after(function() {
    this.server.close()
  })

  it('exist', function() {
    assert(app)
  })

  describe('GET /', function() {

   it('should return a 200', function(done) {
     this.request.get('/', function(error, response) {
       if (error) { done(error) }
       assert.equal(response.statusCode, 200)
       done()
     })
   })

    it('should have a body with the name of the application', function(done) {
      this.request.get('/', function(error, response) {
        if(error) { done(error) }
        assert(response.body.includes('Crowdsource'),
              `"${response.body}" does not include "${'title'}"`)
        done()
      })
    })

    it('should return a 200 on thanks', function(done) {
      this.request.get('/thanks', function(error, response) {
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should return a 200 and a poll does not exist message', function(done) {
      this.request.get('/live_poll/234', function(error, response) {
        if (error) { done(error) }
        assert(response.body.includes('The poll you are looking for'),
              `"${response.body}" does not include ${'title'}`)
        done()
      })
    })

    it('should return a 200 and a feedback poll does not exist message', function(done) {
      this.request.get('/live_feedback/234', function(error, response) {
        if (error) { done(error) }
        assert(response.body.includes('The poll you are looking for'),
              `"${response.body}" does not include ${'title'}`)
        done()
      })
    })

    it('should return a 200 and a feedback vote does not exist message', function(done) {
      this.request.get('/live_feedback_vote/234', function(error, response) {
        if (error) { done(error) }
        assert(response.body.includes('The poll you are looking for'),
              `"${response.body}" does not include ${'title'}`)
        done()
      })
    })
  })

  describe('POST /admin_poll', function() {

    var fixture = {
      question: { question: 'll' },
      answers: { first: 'mm', second: 'kk', third: 'oo' },
      refId: ''
    }

    it('admin should not return a 404', function(done) {
      var payload = {adminPoll: fixture}
      this.request.post('/admin_poll', {form: payload}, function(error, response) {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('feedback should not return a 404', function(done) {
      var payload = {adminPoll: fixture}
      this.request.post('/live_feedback', {form: payload}, function(error, response) {
        if (error) { done(error) }
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })
  })
})
