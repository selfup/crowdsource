'use strict'

const socket = io()
const currentVotes = document.getElementById('current-votes');
const userVote = document.getElementById('user-vote');
const connectionCount = document.getElementById('connection-count')
const buttons = document.querySelectorAll('#choices button');
const statusMessage = document.getElementById('status-message')
const adminPolls = []
const studentPolls = []


socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count
})

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message
})

socket.on('userVote', (message) => {
  userVote.innerText = `Your vote is: ${message} and it has been logged! Thanks for VOTING!`
})

socket.on('voteCount', (votes) => {
  currentVotes.innerText = `Vote A: ${votes["A"]}
   Vote B: ${votes["B"]}
   Vote C: ${votes["C"]}
   Vote D: ${votes["D"]}`
})

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText)
  })
}


$('.submit-live-poll').on('click', (e) => {
  var firstQuality = $('.new-live-poll .f-q').val()
  var secondQuality = $('.new-live-poll .s-q').val()
  var thirdQuality = $('.new-live-poll .t-q').val()
  appendVals('.live-poll', firstQuality, secondQuality, thirdQuality)
})

$('.submit-admin-poll').on('click', (e) => {
  let url = generateAdminUrl()
  appendAdminLink(e, url)
  var firstQuality = $('.new-admin-poll .f-q').val()
  var secondQuality = $('.new-admin-poll .s-q').val()
  var thirdQuality = $('.new-admin-poll .t-q').val()
  appendVals('.admin-poll', firstQuality, secondQuality, thirdQuality)
})

const generateAdminUrl = () => {
  let adminLinkUrl = window.location.href.replace('admin_poll', '')
  const urlHash = Math.random().toString(36).substring(7)
  console.log(urlHash);
  console.log(urlHash);
  return `${adminLinkUrl}admin/${urlHash}`
}

const generateLiveUrl = () => {

}

const pollQualities = (firstQ, secondQ, thirdQ) => {
  return `<div>
    <h3>${firstQ}</h3>
    <h3>${secondQ}</h3>
    <h3>${thirdQ}</h3>
  </div>`
}

const appendVals = (poll, fQ, sQ, tQ) => {
  $(poll).append(
    pollQualities(fQ, sQ, tQ)
  )
}

const appendAdminLink = (e, url) => {
  $('.admin-link-gen').empty()
                      .append(`<div>
                                <a href=${url}>Admin Link</a>
                               </div>`)
}
