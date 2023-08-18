/* eslint-env jquery */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// function declaration

// escape HTML character to prevent cross-site scripting
const escape = function(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
  for (let x = tweets.length - 1; x >= 0; x--) {
    const $tweet = createTweetElement(tweets[x]);
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
  });

};



// function execution

loadTweets();

$(document).ready(() => {

  // nav add tweet button
  const $addTweetButton = $('.add-tweet-button');
  const $newTweet = $(".new-tweet");

  // toggle form and change button text accordingly
  $addTweetButton.on('click', function(event) {
    event.preventDefault();

    $newTweet.slideToggle({
      duration: 200,
      start: () => {
        if ($addTweetButton.text() === "New Tweet") {
          $addTweetButton.text("View Tweets");
        } else {
          $addTweetButton.text("New Tweet");
        }
      }
    });
  });

  // nav bar scrolling
  const $navbar = $('nav');
  const $goTopButton = $('.go-top-button');

  $(document).on('scroll', function() {

    // if document y offset > 30, fade out navbar and show go-top button
    if ($(document).scrollTop() > 30) {
      $navbar.fadeOut();
      $goTopButton.css('display', 'block');
    } else {
      $navbar.fadeIn();
      $goTopButton.css('display', 'none');
    }

  });

  // go top button, scroll to top when clicked
  const $circle = $('.circle');
  $circle.on('click', function() {

    $('html, body').animate({
      scrollTop: 0
    }, 400);
    $addTweetButton.text("View Tweets");
    $newTweet.css('display', 'block');

  });

  // tweet submission
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
          $exceedError.css('display', 'none');
        }
      });


    } else if (tweetText.length > 140) {
      $errorMessage.slideDown({
        duration: 200,
        start: () => {
          $errorMessage.css('display', 'flex');
          $exceedError.css('display', 'block');
          $emptyError.css('display', 'none');
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
      });
    }
  });
});

