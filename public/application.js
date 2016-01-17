'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')
const adminLiveChannel = document.getElementById('admin-live-channel')
const pollCLosed = document.getElementById('closed')

for (var i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    socket.send('voteCast', [this.value, this.name])
  })
}

socket.on("adminLiveChannel", function (message) {
  var url = window.location.href
  var match = url.split('/')[4];
  var stats = message[`${url.split('/')[4]}`]

  return $(adminLiveChannel).html(`<h4>Vote Tallies in Order:</h4>
  <h4>First: ${stats.first} Second: ${stats.second} Third: ${stats.third}</h4>`)
})

socket.on("pollCLosed", function (message) {
  var url = window.location.href
  var match = url.split('/')[4];
  var stats = message[`${url.split('/')[4]}`]

  return $(pollClosed).html(`<h4>Poll Closed</h4>`)
})

$('#close-poll').on('click', () => {
    socket.send('closeThisPoll', "This poll has been closed!")
    $('#closed').append("CLOSED")
})
