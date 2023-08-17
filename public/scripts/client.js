/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(tweet) {
  const $tweet = `
  <article class="tweet">
    <header>
      <img src=${tweet.user.avatars} alt="profile picture" class="sm-user-image">
        <h3 class="user-name">${tweet.user.name}</h3>
        <h3 class="user-handle">${tweet.user.handle}</h3>
    </header>
    <p class="tweet-text">${tweet.content.text}</p>
    <footer>
      <p>${timeago.format(tweet.created_at)}</p>
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
    const $data = $('form').serialize();

    const tweetText = $data.substring(5);
    if (!tweetText) {
      alert("Empty content! Please try again.");
    } else if (tweetText.length > 140) {
      alert("Content exceeds maximum length: 140. Please try again.");
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: $data,
        success: () => {
          console.log($data);
          loadTweets();
        }
      })
    }
  })
});

