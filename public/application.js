'use strict'
const socket = io()
const submitsLive = document.querySelectorAll('#submits-live')

for (var i = 0; i < submitsLive.length; i++) {
  submitsLive[i].addEventListener('click', function () {
    console.log(this);
    socket.send('voteCast', this.value)
    console.log("NOO");
  })
}
