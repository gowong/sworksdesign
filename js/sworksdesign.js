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
  }).always(function() {
    // Clear the form
    $('#contact-form')[0].reset();
  }).done(function(data) {
    alert('success'); 
  }).fail(function(error) {
    alert('error');
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
