'use strict'
const socket = io()
const currentVotes = document.getElementById('current-votes');
const userVote = document.getElementById('submits-live');
const connectionCount = document.getElementById('connection-count')
const buttons = document.querySelectorAll('#choices button');
const statusMessage = document.getElementById('status-message')
const submitsLive = document.getElementById('submits-live')

socket.on('liveAdminVote', (adminVotes) => {
  socket.send(adminVotes[`${window.location.href.split('/')[4]}`])
  console.log(adminVotes[`${window.location.href.split('/')[4]}`]);
})

$('#submits-live').on('click', (e) => {
  socket.send('liveAdminVotes', adminVotes)
  console.log('KJKJK');
  console.log(adminVotes[`${window.location.href.split('/')[4]}`]);
})

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count
})

// socket.on('statusMessage', (message) => {
//   statusMessage.innerText = message
// })

socket.on('userVote', (message) => {
  userVote.innerText = `Your vote is: ${message} and it has been logged! Thanks for VOTING!`;
})

socket.on('submitsLive', (message) => {
  userVote.innerText = `Your vote is: ${message} and it has been logged! Thanks for VOTING!`;
})

// socket.on('voteCount', (votes) => {
//   currentVotes.innerText = `Vote A: ${votes["A"]}
//    Vote B: ${votes["B"]}
//    Vote C: ${votes["C"]}
//    Vote D: ${votes["D"]}`
// })

// for (let i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener('click', function () {
//     socket.send('voteCast', this.innerText)
//   })
// }
