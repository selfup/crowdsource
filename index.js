const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const _ = require('lodash')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const h = require('./helpers.js')

app.locals.adminVotes = {}
app.locals.liveAdPolls = {}
app.locals.adminPolls = {}

const server = http.createServer(app)
  .listen(port, () => {
  console.log('Listening on port ' + port + '.')
})

const io = socketIo(server)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/admin_poll', (req, res) => {
  res.sendFile(__dirname + '/public/admin_poll.html')
})

app.get('/live_feedback', (req, res) => {
  res.sendFile(__dirname + '/public/live_feedback.html')
})

const createObjects = (req, id, tally, liveId) => {
  app.locals.adminPolls[id] = req.body.adminPoll
  app.locals.adminVotes[id] = tally
  app.locals.adminPolls[id]['refId'] = id
  app.locals.liveAdPolls[liveId] = app.locals.adminPolls[id]
  app.locals.adminPolls[id]['liveId'] = _.last(Object.keys(app.locals.liveAdPolls))
}

const findDataAndTally = (data, liveTally) => {
  Object.getOwnPropertyNames(data.answers).forEach(function(val, idx, array) {
    if (data.answers[val] !== '') {
      liveTally[data.answers[val]] = 0
    }
  })
}

app.post('/admin_poll', (req, res) => {
  const url = h.urlGen(req)
  const liveUrl = h.liveUrlGen(req)
  const id = h.urlHash()
  const liveId = h.urlHash()
  const adminTally = {
      first: 0,
      second: 0,
      third: 0
  }
  createObjects(req, id, adminTally, liveId)
  res.render('links', {links: id, url: url, liveId: liveId, liveUrl: liveUrl})
})

const closePoll = (message) => {
  delete app.locals.liveAdPolls[`${message[2]}`]
  io.sockets.emit('pollClosed', message)
}

const closeTime = (feedbackPoll, date, minutes) => {
  var newDate = new Date(date.getTime() + minutes*60000)
  var closingTime = newDate - date
  setTimeout(function() {
    closePoll(['This poll has been closed!', feedbackPoll['refId'], feedbackPoll['liveId']])
  }, closingTime)
}

app.post('/live_feedback', (req, res) => {
  const url = h.urlGen(req)
  const liveUrl = h.feedbackUrlGen(req)
  const id = h.urlHash()
  const liveId = h.urlHash()
  const liveTally = {}
  createObjects(req, id, liveTally, liveId)
  findDataAndTally(app.locals.liveAdPolls[`${liveId}`], liveTally)
  if (req.body.minutes) {
    closeTime(app.locals.liveAdPolls[`${liveId}`], new Date(), req.body.minutes)
  }
  res.render('live_feedback_links', {links: id, url: url, liveId: liveId,
                                                          liveUrl: liveUrl})
})

app.get('/admin_poll/:id', (req, res) => {
  const url = h.urlGen(req)
  const link = url.split('/')[4]

  if (!app.locals.adminPolls[`${link}`]) {
    res.render('404')
  } else {
    res.render('admin', {adminPolls: app.locals.adminPolls[`${link}`], link: link})
  }
})


app.get('/live_poll/:id', (req, res) => {
  const url = h.urlGen(req)
  const liveLink = url.split('/')[4]

  if (!app.locals.liveAdPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveAdminPoll', { liveAdPolls: app.locals.liveAdPolls[`${liveLink}`]})
  }
})

app.get('/live_feedback_vote/:id', (req, res) => {
  const url = h.urlGen(req)
  const liveLink = url.split('/')[4]
  if (!app.locals.liveAdPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveFeedBackVote', { liveAdPolls: app.locals.liveAdPolls[`${liveLink}`]})
  }
})

app.get('/live_feedback/:id', (req, res) => {
  const url = h.urlGen(req)
  const liveLink = url.split('/')[4]

  if (!app.locals.adminPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveFeedBackPoll',
                {
                  liveAdPolls: app.locals.adminPolls[`${liveLink}`],
                  adminVotes: app.locals.adminVotes[`${liveLink}`]
                }
              )
  }
})

app.get('/thanks', (req, res) => {
  res.render('thanks')
})

io.sockets.on('connection', (socket) => {
  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      app.locals.adminVotes[`${message[1]}`][`${[message[0]]}`] += 1
      io.sockets.emit('adminLiveChannel', app.locals.adminVotes)
    }
    if (channel === 'closeThisPoll') {
      delete app.locals.liveAdPolls[`${message[2]}`]
      io.sockets.emit('pollClosed', message)
    }
    if (channel === 'feedbackCast') {
      var updateVal = message[0]
      var updateThisVal = app.locals.liveAdPolls[`${message[1]}`]['answers'][`${updateVal}`]
      app.locals.adminVotes[`${message[2]}`][`${updateThisVal}`] += 1
      io.sockets.emit('liveFeedBack', [app.locals.adminVotes, app.locals.liveAdPolls])
    }
  })
})

module.exports = app
