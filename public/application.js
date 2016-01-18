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
    console.log(this.value);
    console.log(this.name);
    debugger
    socket.send('feedbackCast', [this.value, this.name])
  })
}

const matchUrl = () => {
  return window.location.href.split('/')[4]
}

socket.on("liveFeedBack", function (message) {
  console.log(message);
  var match = matchUrl()
  var stats = message[`${match}`]

  return $(liveFeedBack).html(`<h4>${message}</h4>`)
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

$('#close-poll').on('click', () => {
  var match = matchUrl()
  var liveIdRef = $('#live-id').text()

  socket.send('closeThisPoll', ["This poll has been closed!", match, liveIdRef])
})
