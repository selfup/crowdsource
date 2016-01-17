'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')
const adminLiveChannel = document.getElementById('admin-live-channel')

for (var i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    socket.send('voteCast', [this.value, this.name])
  })
}

socket.on("adminLiveChannel", function (message) {
  var url = window.location.href
  var match = url.split('/')[4];
  var stats = message[`${url.split('/')[4]}`]

  return $(adminLiveChannel).html(`<h3>Vote Tallies in Order:</h3>
    <h3>First: ${stats.first} Second: ${stats.second} Third: ${stats.third}</h3>`)
})
