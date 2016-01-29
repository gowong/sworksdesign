Parse.Cloud.define("email", function(request, response) {
  var mailgun = require('mailgun');
  mailgun.initialize('sworksdesign.com', '***REMOVED***');

  var name = request.params.name;
  var email = request.params.email;
  var subject = request.params.subject;
  var message = request.params.message;

  if (!name) {
    response.error('"name" is required.');
    return;
  }
  if (!email) {
    response.error('"email" is required.');
    return;
  }
  if (!subject) {
    response.error('"subject" is required.');
    return;
  }
  if (!message) {
    response.error('"message" is required.');
    return;
  }

  mailgun.sendEmail({
      to: 'Sworksdesign.films@gmail.com',
      from: name + ' <' + email + '>',
      subject: subject,
      text: message
  }, {
      success: function(httpResponse) {
          console.log(httpResponse);
          response.success("Email sent!");
      },
      error: function(httpResponse) {
         console.error(httpResponse);
         response.error("Uh oh, something went wrong");
      }
  });
});
