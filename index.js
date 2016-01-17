const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const _ = require('lodash')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const Helper = require('./helpers.js')
const adminVotes = {}
const adminPolls = {}
const liveAdminPolls = {}
const adminUserPolls = {}

const $ = require('jquery')

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

app.post('/admin_poll', (req, res) => {
  const url = new Helper(req).urlGen
  const liveUrl = new Helper(req).liveUrlGen
  const id = new Helper().urlHash
  const liveId = new Helper().urlHash

  const adminTally = {
      first: 0,
      second: 0,
      third: 0
  }

  adminPolls[id] = req.body.adminPoll; adminVotes[id] = adminTally
  adminPolls[`${id}`]['refId'] = id; liveAdminPolls[liveId] = adminPolls[id]
  res.render('links', {links: id, url: url, liveId: liveId, liveUrl: liveUrl})
})

app.get('/admin_poll/:id', (req, res) => {
  const url = new Helper(req).urlGen
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
  const url = new Helper(req).urlGen
  const liveLink = url.split('/')[4]

  if (!liveAdminPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveAdminPoll', { liveAdminPolls: liveAdminPolls[`${liveLink}`]})
  }
})

app.get('/thanks', (req, res) => {
  res.render('thanks')
})

app.get('/student_poll', (req, res) => {
  res.sendFile(__dirname + '/public/student_poll.html')
})

io.on('connection', (socket) => {
  io.sockets.emit('usersConnected', io.engine.clientsCount)
  io.emit('liveAdminVote', adminVotes)
  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      adminVotes[`${message[1]}`][`${[message[0]]}`] += 1
      io.emit('adminLiveChannel', adminVotes)
    }
  })

  socket.on('disconnect', () => {
    io.sockets.emit('usersConnected', io.engine.clientsCount)
  })
})

module.exports = server
