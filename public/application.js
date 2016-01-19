'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')
const submitsLiveFeedback = document.querySelectorAll('#submits-feedback')
const adminLiveChannel = document.getElementById('admin-live-channel')
const pollClosed = document.getElementById('closed')
const liveFeedBack = document.getElementById('live-feedback')
var count = 0
var buttonCount = 0

for (var i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    socket.send('voteCast', [this.value, this.name])
  })
}

for (var i = 0; i < submitsLiveFeedback.length; i++) {
  submitsLiveFeedback[i].addEventListener('click', function () {
    socket.send('feedbackCast', [this.value, this.name, this.title])
  })
}

$('#votes #submits-feedback').on('click', function () {
  $('#votes').hide()
})

const matchUrl = () => {
  return window.location.href.split('/')[4]
}

const updateVoter = (stats, displayVotes) => {
  $('#thanks').html(`<h4>Thanks for Voting!</h4>`)
  displayFeedback(stats, displayVotes)
  return $(liveFeedBack).html(`<h4>${displayVotes.join(' ')}</h4>`)
}

const updatePoller = (stats, displayVotes) => {
  displayFeedback(stats, displayVotes)
  return $(liveFeedBack).html(`<h4>${displayVotes.join(' ')}</h4>`)
}

const displayFeedback = (stats, displayVotes) => {
  if (stats !== undefined) {
    Object.getOwnPropertyNames(stats).forEach(function(val, idx, array) {
      var keysForObj = Object.keys(stats)
      displayVotes.push(`${keysForObj[idx]}: ${stats[val]}`)
    })
  }
}

socket.on("liveFeedBack", function (message) {
  var match = matchUrl()
  if (message[0][match]) {
    var displayVotes = []
    updatePoller(message[0][match], displayVotes)
  } else if (message[1][match]['refId']) {
    var displayVotes = []
    updateVoter(message[0][message[1][match]['refId']], displayVotes)
  }
})

socket.on("adminLiveChannel", function (message) {
  var match = matchUrl()
  var stats = message[`${match}`]
  return $(adminLiveChannel).html(`<h4>Vote Tallies in Order:</h4>
  <h4>First: ${stats.first} Second: ${stats.second} Third: ${stats.third}</h4>`)
})

socket.on("pollClosed", function (message) {
  var match = matchUrl()
  if (match === message[1]) {
    return $(pollClosed).html(`<h4>Poll Closed</h4>`)
  } else if (match === message[2]) {
    $('#votes').hide()
    return $(pollClosed).html(`<h4>Poll Closed</h4>`)
  }
})

$('#add-field').on('click', function () {
  buttonCount ++
  if (buttonCount > 1) {
    alert('Only 4 buttons')
  } else {
    $('#add-button').append(`<input name='adminPoll[answers][fourth]' type="text">`)
  }
})

$('#close-feedback').on('click', function () {
  var match = matchUrl()
  var liveIdRef = this.name
  socket.send('closeThisPoll', ["This poll has been closed!", match, liveIdRef])
})

$('#close-poll').on('click', () => {
  var match = matchUrl()
  var liveIdRef = $('#live-id').text()
  socket.send('closeThisPoll', ["This poll has been closed!", match, liveIdRef])
})
