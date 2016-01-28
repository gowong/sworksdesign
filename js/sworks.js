var SCROLL_SPEED = 1000;
var MAILGUN_API_URL = 'https://api.mailgun.net/v3/sworksdesign.com/messages';
var MAILGUN_API_USERNAME = 'api';
var MAILGUN_API_KEY = '***REMOVED***';
var TO_EMAIL = 'Sworksdesign.films@gmail.com';

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
  var base64Auth = btoa(MAILGUN_API_USERNAME + ':' + MAILGUN_API_KEY);
  var headers = {
    authorization: 'Basic ' + base64Auth
  };

  // Build form data
  var name = $('#contact-form-name').val();
  var email = $('#contact-form-email').val();
  var subject = $('#contact-form-subject').val();
  var message = $('#contact-form-message').val();
  var data = {
    to: TO_EMAIL,
    from: name + ' <' + email +'>',
    subject: subject,
    text: message
  };

  // Convert JSON to form data
  var formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }

  // Send email request
  $.ajax({
    method: 'POST',
    url: MAILGUN_API_URL,
    headers: headers,
    data: formData,
    mimeType: 'multipart/form-data',
    crossDomain: true,
    cache: false,
    contentType: false,
    processData: false
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
