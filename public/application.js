'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')
const adminLiveChannel = document.getElementById('#admin-live-channel')

for (var i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    socket.send('voteCast', [this.value, this.name])
  })
}

socket.on("adminLiveChannel", (message) => {
  console.log(message);
  adminLiveChannel.innerText = `${message}`
})
