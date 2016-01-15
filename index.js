const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const _ = require('lodash')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const votes = {}
const adminPolls = {}
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

const urlHash = () => {
  return Math.random().toString(36).substring(7)
}

app.post('/admin_poll', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  var id = urlHash()
  adminPolls[id] = req.body.adminPoll
  console.log(adminPolls);
  res.render('links', {links: id, url: url});
})

app.get('*/admin_poll/:id', (req, res) => {
  res.render('admin', {adminPolls: adminPolls});
})

app.get('/live_poll', (req, res) => {
  res.sendFile(__dirname + '/public/live_poll.html')
})

app.get('/admin_poll', (req, res) => {
  res.sendFile(__dirname + '/public/admin_poll.html')
})

app.get('/student_poll', (req, res) => {
  res.sendFile(__dirname + '/public/student_poll.html')
})

io.on('connection', (socket) => {
  io.sockets.emit('usersConnected', io.engine.clientsCount)
  socket.emit('statusMessage', 'You have connected.')

  socket.on('message', (channel, message) => {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('userVote', message)
      socket.emit('voteCount', countVotes(votes))
    }
  })

  socket.on('disconnect', () => {
    delete votes[socket.id]
    io.sockets.emit('usersConnected', io.engine.clientsCount)
  })
})

const countVotes = (votes) => {
  const voteCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
  }
  for (vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount
}

module.exports = server
