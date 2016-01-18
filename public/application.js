'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')
const submitsLiveFeedback = document.querySelectorAll('#submits-feedback')
const adminLiveChannel = document.getElementById('admin-live-channel')
const pollClosed = document.getElementById('closed')
const liveFeedBack = document.getElementById('live-feedback')

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
      console.log(keysForObj);
      displayVotes.push(`${keysForObj[idx]}: ${stats[val]}`)
    })
  }
}

socket.on("liveFeedBack", function (message) {
  var match = matchUrl()
  var h = message[1][`${match}`]['refId']
  var stats = message[0][`${h}`]
  var displayVotes = []
  updatePoller(stats, displayVotes)
})

// socket.on("liveFeedBack", function (message) {
//   var match = matchUrl()
//   console.log(message);
//   var stats = message[0][`${match}`]
//   var stats2 = message[1][`${match}`]
//   var displayVotes = []
//   if (match === Object.keys(message[0])[0]) {
//     updatePoller(stats, displayVotes)
//   } else if (match === Object.keys(message[1])[0]) {
//     updateVoter(stats2, displayVotes)
//   } else {
//     console.log('NOPE')
//   }
// })

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

$('#close-poll').on('click', () => {
  var match = matchUrl()
  var liveIdRef = $('#live-id').text()
  socket.send('closeThisPoll', ["This poll has been closed!", match, liveIdRef])
})
