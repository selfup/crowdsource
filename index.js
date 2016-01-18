const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const _ = require('lodash')
const app = express()
const port = process.env.PORT || 3000
const adminVotes = {}
const adminPolls = {}
const liveAdPolls = {}
const adminUserPolls = {}
const bodyParser = require('body-parser')
const h = require('./helpers.js')

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
  adminPolls[id] = req.body.adminPoll
  adminVotes[id] = tally
  adminPolls[id]['refId'] = id
  liveAdPolls[liveId] = adminPolls[id]
  adminPolls[id]['liveId'] = _.last(Object.keys(liveAdPolls))
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

const findDataAndTally = (data, liveTally) => {
  Object.getOwnPropertyNames(data.answers).forEach(function(val, idx, array) {
    if (liveTally[data.answers[val]] !== '') {
      liveTally[data.answers[val]] = 0
    }
  })
}

app.post('/live_feedback', (req, res) => {
  const url = h.urlGen(req)
  const liveUrl = h.liveUrlGen(req)
  const id = h.urlHash()
  const liveId = h.urlHash()
  const liveTally = {}
  createObjects(req, id, liveTally, liveId)
  findDataAndTally(liveAdPolls[`${liveId}`], liveTally)

  console.log(liveTally);
  res.render('live_feedback_links', {links: id, url: url, liveId: liveId, liveUrl: liveUrl})
})

app.get('/admin_poll/:id', (req, res) => {
  const url = h.urlGen(req)
  const link = url.split('/')[4]

  if (!adminPolls[`${link}`]) {
    res.render('404')
  } else {
    res.render('admin', {adminPolls: adminPolls[`${link}`], link: link})
  }
})

app.get('/thanks', (req, res) => {
  res.render('thanks')
})

app.get('/live_poll/:id', (req, res) => {
  const url = h.urlGen(req)
  const liveLink = url.split('/')[4]

  if (!liveAdPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveAdminPoll', { liveAdPolls: liveAdPolls[`${liveLink}`]})
  }
})

app.get('/thanks', (req, res) => {
  res.render('thanks')
})

io.on('connection', (socket) => {
  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      adminVotes[`${message[1]}`][`${[message[0]]}`] += 1
      io.emit('adminLiveChannel', adminVotes)
    }
    if (channel === 'closeThisPoll') {
      delete liveAdPolls[`${message[2]}`]
      io.emit('pollClosed', message)
    }
  })

  socket.on('disconnect', () => {
    io.sockets.emit('usersConnected', io.engine.clientsCount)
  })
})

module.exports = server
