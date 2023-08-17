$(document).ready(() => {
  $('#tweet-text').on('input', function() {
    // get input length and subtract it from char limit
    let remainingChars = 140 - ($(this).val()).length;

    // counter obj
    let $counter = $(this).siblings('.send-tweet').find('.counter');

    // apply text color based on remainingChars
    if (remainingChars < 0) {
      $counter.addClass('red');
    } else {
      $counter.removeClass('red');
    }

    // update counter value
    $counter.val(remainingChars);
  });
});





