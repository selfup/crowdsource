const ejs = require('ejs')
const http = require('http')
const express = require('express')
const socketIo = require('socket.io')
const _ = require('lodash')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const votes = {}
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

const urlHash = () => {
  return Math.random().toString(36).substring(7)
}

const urlGen = (req) => {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`
}

const liveUrlGen = (req) => {
  return `${req.protocol}://${req.get('host')}/live_poll`
}

app.get('/admin_poll', (req, res) => {
  res.sendFile(__dirname + '/public/admin_poll.html')
})

app.post('/admin_poll', (req, res) => {
  const url = urlGen(req); const liveUrl = liveUrlGen(req)
  const id = urlHash(); const liveId = urlHash()

  adminPolls[id] = req.body.adminPoll; adminVotes[id] = adminTally
  adminPolls[`${id}`]['refId'] = id; liveAdminPolls[liveId] = adminPolls[id]
  console.log(liveAdminPolls)
  console.log(adminPolls)
  console.log(adminVotes)
  res.render('links', {links: id, url: url, liveId: liveId, liveUrl: liveUrl});
})

app.get('/admin_poll/:id', (req, res) => {
  const url = urlGen(req)
  const link = url.split('/')[4]

  if (!adminPolls[`${link}`]) {
    res.render('404')
  } else {
    res.render('admin', {adminPolls: adminPolls[`${link}`], link: link});
  }
})

app.get('/live_poll/:id', (req, res) => {
  const url = urlGen(req)
  const liveLink = url.split('/')[4]

  if (!liveAdminPolls[`${liveLink}`]) {
    res.render('404')
  } else {
    res.render('liveAdminPoll', { liveAdminPolls: liveAdminPolls[`${liveLink}`]});
  }
})

app.post('/live_poll', (req, res) => {
  const url = urlGen(req); const liveUrl = liveUrlGen(req)
  const id = urlHash(); const liveId = urlHash()
  const refAdID = req.body.liveAdVote
  const propUpdate = refAdID[`${Object.keys(refAdID)[0]}`]
  const adminVoteObject = adminVotes[`${Object.keys(refAdID)[0]}`]
  console.log(adminVoteObject[propUpdate] += 1)
  console.log('SENT')
  res.sendFile(__dirname + '/public/thanks.html')
})

app.get('/student_poll', (req, res) => {
  res.sendFile(__dirname + '/public/student_poll.html')
})

io.on('connection', (socket) => {
  io.sockets.emit('usersConnected', io.engine.clientsCount)
  io.sockets.send(adminVotes)
  io.emit('liveAdminVote', adminVotes)
  console.log('WOW')
  console.log(adminVotes)
  socket.on('message', (channel, message) => {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('userVote', message)
      console.log('lolol')
      socket.emit('voteCount', countVotes(votes))
    }
  })

  socket.on('disconnect', () => {
    delete votes[socket.id]
    io.sockets.emit('usersConnected', io.engine.clientsCount)
  })
})

const adminTally = {
    first: 0,
    second: 0,
    third: 0
}

module.exports = server
