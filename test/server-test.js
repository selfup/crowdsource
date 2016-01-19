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

    beforeEach(() => {
      app.locals.adminPolls = {}
      app.locals.adminVotes = {}
      app.locals.liveAdPolls = {}
    })

    var fixture = {
      question: { question: 'll' },
      answers: { first: 'mm', second: 'kk', third: 'oo' },
      refId: ''
    }

    var feedbackFixture = { question: { question: 'Works?' },
                            answers: { first: 'Yes', second: 'No', third: 'Maybe' },
                            phone: { phone: '111 111-1111' },
                            refId: 'lfvv33xflxr',
                            liveId: 'f7fs7fd2t9' }

    it('admin should not return a 404', function(done) {
      var payload = {adminPoll: fixture}
      this.request.post('/admin_poll', {form: payload}, function(error, response) {
        if (error) { done(error) }

        var adminPollsCount = Object.keys(app.locals.adminPolls).length
        var liveAdPollsCount = Object.keys(app.locals.liveAdPolls).length
        var adminVotesCount = Object.keys(app.locals.adminVotes).length

        // For Showing How Objects Are Created ********************************
        var exampleAdminPolls = { d7py6ab57b9:
                                  { question: { question: 'll' },
                                    answers: { first: 'mm', second: 'kk', third: 'oo' },
                                    refId: 'd7py6ab57b9',
                                    liveId: '8kreiwfjemi' }
                                }
        var exampleLiveAdPolls = { '8kreiwfjemi':
                                   { question: { question: 'll' },
                                     answers: { first: 'mm', second: 'kk', third: 'oo' },
                                     refId: 'd7py6ab57b9',
                                     liveId: '8kreiwfjemi' }
                                  }
        var exampleAdminVotes = { d7py6ab57b9: { first: 0, second: 0, third: 0 } }
        // End of Non Used Dummy Data******************************************

        assert.equal(adminPollsCount, 1, `Expected 1 adminPolls, found ${adminPollsCount}`)
        assert.equal(liveAdPollsCount, 1, `Expected 1 adminPolls, found ${liveAdPollsCount}`)
        assert.equal(adminVotesCount, 1, `Expected 1 adminPolls, found ${adminVotesCount}`)
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })

    it('feedback should not return a 404', function(done) {
      var payload = {adminPoll: feedbackFixture}
      this.request.post('/live_feedback', {form: payload}, function(error, response) {
        if (error) { done(error) }

        var adminPollsCount = Object.keys(app.locals.adminPolls).length
        var liveAdPollsCount = Object.keys(app.locals.liveAdPolls).length

        // For Showing How Objects Are Created ********************************
        var exampleLiveAdPolls = { lfvv33xflxr:
           { question: { question: 'Works?' },
             answers: { first: 'Yes', second: 'No', third: 'Maybe' },
             phone: { phone: '111 111-1111' },
             refId: 'lfvv33xflxr',
             liveId: 'f7fs7fd2t9' } }
        var exampleAdminPolls = { f7fs7fd2t9:
           { question: { question: 'Works?' },
             answers: { first: 'Yes', second: 'No', third: 'Maybe' },
             phone: { phone: '111 111-1111' },
             refId: 'lfvv33xflxr',
             liveId: 'f7fs7fd2t9' } }
        var exampleVoteTally = { Yes: 0, No: 0, Maybe: 0 }
        // End of Non Used Dummy Data *****************************************

        assert.equal(adminPollsCount, 1, `Expected 1 adminPolls, found ${adminPollsCount}`)
        assert.equal(liveAdPollsCount, 1, `Expected 1 adminPolls, found ${liveAdPollsCount}`)
        assert.notEqual(response.statusCode, 404)
        done()
      })
    })
  })
})
