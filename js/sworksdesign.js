var SCROLL_SPEED = 1000;
var IMAGE_FADE_DELAY = 600;
var MATERIALBOX_ZOOM_DURATION = 200;
var PARSE_API_URL = 'https://api.parse.com/1/functions/email';
var PARSE_APP_ID = 'cOLehws9n6R0OlPU6sN5yNe2bNrd0eiYct8YLHdi';
var PARSE_REST_API_KEY = '6akvWrdhzRJ4RQv7QmK6SjhT43sGCY5Mql4GcOI5';
var YOUTUBE_IFRAME_API = 'https://www.youtube.com/iframe_api';
var youTubePlayer;
var isYoutubeAPIReady;
var initYouTubePlayerOnAPIReady;
var imageZoomTimer;

function setupScrollLink(link, target) {
  $(link).on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, SCROLL_SPEED);
  });
}

function setupPortfolioVideos() {
  // Immediately initialize YouTube API so that it's ready when a video is played
  initYouTubeAPI();

  // Handle play icon clicks
  $('.portfolio-img-container > i').on('click', function() {
    $(this).next().find('.portfolio-img').click();
  });

  // Handle image clicks
  $('.materialboxed').on('click', function() {
    if (isYoutubeAPIReady) {
      initYouTubePlayer();
    } else {
      initYouTubePlayerOnAPIReady = true;
    }

    // Close video when clicking the overlay
    $('#materialbox-overlay').on('click', closeVideo);
  });

  // Close when pressing 'esc'
  $(document).on('keyup', function(e) {
    if (e.keyCode === 27) {
      closeVideo();
    }
  });

  // Close video when scrolling the window
  $(window).on('scroll', $.debounce(250, true, closeVideo));
}

function initYouTubeAPI() {
  // Async initialization of the YouTube API
  var script = $('<script></script>').attr('src', YOUTUBE_IFRAME_API);
  $('head').prepend(script);
}

// Called when the YouTube API is ready
function onYouTubeIframeAPIReady() {
  isYoutubeAPIReady = true;
  // Initialize player if the user tried opening the player when the API was
  // still loading
  if (initYouTubePlayerOnAPIReady) {
    initYouTubePlayerOnAPIReady = false;
    initYouTubePlayer();
  }
}

function initYouTubePlayer() {
  var videoPlayer = $('#video-player')[0];
  var image = $('.materialboxed.active');

  // Show loading spinner
  setTimeout(function() {
    showVideoLoadingSpinner();
  }, MATERIALBOX_ZOOM_DURATION);

  // Initialize player
  youTubePlayer = new YT.Player(videoPlayer, {
    width: image.width(),
    height: image.height(),
    videoId: image.attr('data-video-id'),
    playerVars: {
      autohide: 1,
      rel: 0
    },
    events: {
      onReady: function() {
        hideVideoLoadingSpinner();
        playVideo();
      }
    }
  });
}

function playVideo() {
  // Position the video on top of the zoomed image
  var image = $('.materialboxed.active');
  var imageWidth = image.width();
  var imageHeight = image.height();
  var videoPlayer = $(youTubePlayer.getIframe());
  videoPlayer.css('max-width', image.css('max-width'));
  videoPlayer.css('width', imageWidth);
  videoPlayer.css('height', imageHeight);
  videoPlayer.css('top', 'calc(50% - ' + (imageHeight / 2) + 'px)');
  videoPlayer.css('left', 'calc(50% - ' + (imageWidth / 2) + 'px)');
  // Add shadow
  videoPlayer.addClass('z-depth-1');

  // Hide image and show video with a fade animation
  image.css('opacity', 0);
  videoPlayer.css('opacity', 1);

  // Reset image visibility styles after the animation ends so that the image
  // can visibly unzoom when the video is closed
  imageZoomTimer = setTimeout(function() {
    image.css('opacity', 1);
    // In case the video player is not perfectly aligned with the image
    image.css('visibility', 'hidden');
  }, IMAGE_FADE_DELAY);

  // Play video
  youTubePlayer.setPlaybackQuality('highres');
  youTubePlayer.playVideo();
}

function closeVideo() {
  // Clear image zoom timer
  if (imageZoomTimer) {
    clearTimeout(imageZoomTimer);
    imageZoomTimer = null;
  }

  // Show image
  var image = $('.materialboxed.active');
  image.css('visibility', 'visible');
  image.css('opacity', '');

  // Destroy video
  hideVideoLoadingSpinner();
  if (youTubePlayer && !!youTubePlayer.getIframe()) {
    youTubePlayer.destroy();
  }
}

function showVideoLoadingSpinner() {
  var loadingSpinner = $('#video-player-spinner');
  loadingSpinner.removeClass('hidden');
  loadingSpinner.addClass('active');
}

function hideVideoLoadingSpinner() {
  var loadingSpinner = $('#video-player-spinner');
  loadingSpinner.addClass('hidden');
  loadingSpinner.removeClass('active');
}

function resetContactForm() {
  $('#contact-form-flip-container > .card-panel').removeClass('flipped');
  // Clear the form
  $('#contact-form')[0].reset();
  // Hide after a delay so that they are still shown during the animation
  setTimeout(function() {
    $('#contact-form-message-container .green-text').addClass('hide');
    $('#contact-form-message-container .red-text').addClass('hide');
  }, 1000);
}

function showContactSuccessMessage() {
  $('#contact-form-message-container .green-text').removeClass('hide');
  $('#contact-form-message-container .red-text').addClass('hide');
}

function showContactErrorMessage() {
  $('#contact-form-message-container .green-text').addClass('hide');
  $('#contact-form-message-container .red-text').removeClass('hide');
}

function submitContactForm() {
  // Build headers
  var headers = {
    'x-parse-application-id': PARSE_APP_ID,
    'x-parse-rest-api-key': PARSE_REST_API_KEY
  };

  // Build data
  var data = {
    name: $('#contact-form-name').val(),
    email: $('#contact-form-email').val(),
    subject: $('#contact-form-subject').val(),
    message: $('#contact-form-message').val()
  };

  // Send email request
  $.ajax({
    method: 'POST',
    url: PARSE_API_URL,
    headers: headers,
    data: data,
    crossDomain: true,
    dataType: 'json'
  }).done(function(data) {
    showContactSuccessMessage();
  }).fail(function(error) {
    showContactErrorMessage();
    // Flip card back after a delay
    setTimeout(function() {
      resetContactForm();
    }, 3000);
  }).always(function() {
    // Flip contact form card
    $('#contact-form-flip-container > .card-panel').toggleClass('flipped');
  });
}

$(function() {
  // Setup scroll links
  setupScrollLink('#hero-scroll', '#about-section');
  setupScrollLink('#footer-scroll', '#hero-container');

  // Setup portfolio videos
  setupPortfolioVideos();

  // Initialize parallax images
  // $('.parallax').parallax();

  // Handle contact form submission
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    submitContactForm();
  });
});
