'use strict'
const socket = io()
const currentVotes = document.getElementById('current-votes');
const userVote = document.getElementById('submits-live');
const connectionCount = document.getElementById('connection-count')
const buttons = document.querySelectorAll('#choices button');
const statusMessage = document.getElementById('status-message')
const submitsLive = document.querySelectorAll('#submits-live')

socket.on('liveAdminVote', (adminVotes) => {
  socket.send(adminVotes[`${window.location.href.split('/')[4]}`])
  console.log(adminVotes[`${window.location.href.split('/')[4]}`]);
})

for (let i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    console.log('AHHH');
    socket.send('voteCast', "LOL")
    console.log("NOO");
  })
}
//
// socket.on('click', (e) => {
//   socket.send('voteCast', adminVotes)
//   console.log('KJKJK');
//   console.log(adminVotes[`${window.location.href.split('/')[4]}`]);
// })

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count
})

socket.on('userVote', (message) => {
  userVote.innerText = `Your vote is: ${message} and it has been logged! Thanks for VOTING!`;
})

socket.on('submitsLive', (message) => {
  socket.send(adminVotes[`${window.location.href.split('/')[4]}`])
  console.log(adminVotes[`${window.location.href.split('/')[4]}`]);
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
