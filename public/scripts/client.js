/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// escape HTML character to prevent cross-site scripting
const escape = function(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const createTweetElement = function(tweet) {
  const $tweet = `
  <article class="tweet">
    <header>
      <img src=${tweet.user.avatars} alt="profile picture" class="sm-user-image">
        <h3 class="user-name">${escape(tweet.user.name)}</h3>
        <h3 class="user-handle">${escape(tweet.user.handle)}</h3>
    </header>
    <p class="tweet-text">${escape(tweet.content.text)}</p>
    <footer>
      <p>${escape(timeago.format(tweet.created_at))}</p>
      <div class="action-icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
  </article>`;

  return $tweet;

};

const renderTweets = function(tweets) {
  $('.tweets-container').empty();
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweets-container').append($tweet);
  }
};

const loadTweets = function() {
  $.ajax({
    type: 'GET',
    url:'/tweets/',
    success: function(data) {
      renderTweets(data);
    }
  })
};

loadTweets();

$(document).ready( () => {

  $('form').on('submit', function(event)  {
    event.preventDefault();
    const $form = $(this);
    const $data = $('form').serialize();
    const $errorMessage = $form.find('.error-message');
    const $emptyError = $form.find('.empty-error');
    const $exceedError = $form.find('.exceed-error');


    const tweetText = $data.substring(5);
    if (!tweetText) {
      $errorMessage.slideDown({
        duration: 200,
        start: () => {
          $errorMessage.css('display', 'flex');
          $emptyError.css('display', 'block');
        }
      });


    } else if (tweetText.length > 140) {
      $errorMessage.slideDown({
        duration: 200,
        start: () => {
          $errorMessage.css('display', 'flex');
          $exceedError.css('display', 'block');
        }
      });
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: $data,
        success: () => {
          $form.children('textarea').val('');
          $errorMessage.css('display', 'none');
          $emptyError.css('display', 'none');
          $exceedError.css('display', 'none');
          loadTweets();
        }
      })
    }
  })
});

