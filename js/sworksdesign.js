var SCROLL_SPEED = 1000;
var PARSE_API_URL = 'https://api.parse.com/1/functions/email';
var PARSE_APP_ID = 'cOLehws9n6R0OlPU6sN5yNe2bNrd0eiYct8YLHdi';
var PARSE_REST_API_KEY = '6akvWrdhzRJ4RQv7QmK6SjhT43sGCY5Mql4GcOI5';

function setupScrollLink(link, target) {
  $(link).on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, SCROLL_SPEED);
  });
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

  // Initialize parallax images
  $('.parallax').parallax();

  // Handle contact form submission
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    submitContactForm();
  });
});
