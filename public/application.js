$('.submit-live-poll').on('click', (e) => {
  console.log('wow');

  var firstQuality = $('.new-live-poll .f-q').val()
  var secondQuality = $('.new-live-poll .s-q').val()
  var thirdQuality = $('.new-live-poll .t-q').val()

  $('.live-poll').append(
    pollQualities(firstQuality, secondQuality, thirdQuality)
  )
})

$('.submit-admin-poll').on('click', (e) => {
  console.log('wow');

  var firstQuality = $('.new-admin-poll .f-q').val()
  var secondQuality = $('.new-admin-poll .s-q').val()
  var thirdQuality = $('.new-admin-poll .t-q').val()

  $('.admin-poll').append(
    pollQualities(firstQuality, secondQuality, thirdQuality)
  )
})

const pollQualities = (firstQ, secondQ, thirdQ) => {
  return `<div>
    <h3>${firstQ}</h3>
    <h3>${secondQ}</h3>
    <h3>${thirdQ}</h3>
  </div>`
}
