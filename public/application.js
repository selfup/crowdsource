$('.submit-live-poll').on('click', (e) => {
  console.log('wow');

  var firstQuality = $('.new-live-poll .f-q').val()
  var secondQuality = $('.new-live-poll .s-q').val()
  var thirdQuality = $('.new-live-poll .t-q').val()

  $('.live-poll').append(
    `<div>
      <h3>${firstQuality}</h3>
      <h3>${secondQuality}</h3>
      <h3>${thirdQuality}</h3>
    </div>`
  )
})

$('.submit-admin-poll').on('click', (e) => {
  console.log('wow');

  var firstQuality = $('.new-admin-poll .f-q').val()
  var secondQuality = $('.new-admin-poll .s-q').val()
  var thirdQuality = $('.new-admin-poll .t-q').val()

  $('.admin-poll').append(
    `<div>
      <h3>${firstQuality}</h3>
      <h3>${secondQuality}</h3>
      <h3>${thirdQuality}</h3>
    </div>`
  )
})
