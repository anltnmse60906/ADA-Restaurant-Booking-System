var nodeMailer = require("nodemailer");
var clientSecret = require("../client_secrete");

const bodyEmailTemplate = (message) => {

  // "<p>Dear, ${firstName} ${lastName}</p>" +
  return "<style>" +
    "table {" +
    "font-family: arial, sans-serif;" +
    "border-collapse: collapse;" +
    "width: 100%;" +
    "}" +
    "" +
    "td, th {" +
    "border: 1px solid #dddddd;" +
    "text-align: left;" +
    "padding: 8px;" +
    "}" +
    "" +
    "tr:nth-child(even) {" +
    "background-color: #dddddd;" +
    "}" +
    "</style>" +

    "<p>Dear, " + message.firstName + " " + message.lastName + "</p>" +
    "<p>Your booking is confirmed !</p>" +
    "<h3>Your booking information</h3>" +
    "<table>" +
    "<tr>" +
    "<th>Booking for</th>" +
    "<td>" + message.section + "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Booking for date</th>" +
    "<td>" + message.bookingDate + "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>Maximum for people</th>" +
    "<td>" + message.totalPeople + "</td>" +
    "</tr>" +
    "<th>Tables</th>" +
    "<td>" + message.tables + "</td>" +
    "</tr>" +
    "</tr>" +
    "<th>Requirement</th>" +
    "<td>" + message.requirement + "</td>" +
    "</tr>" +
    "</tr>" +
    "<th>Booking on Date: </th>" +
    "<td>" +message.createDate +"</td>" +
    "</tr>" +
    "</table>" +
    "<p>Thank your so much!!!</p>";
}

exports.sendEmails = (message, fail, success) => {

  // message = bodyEmailTemplate;

  const messageTemplate = {
    to: message['receiver'],
    subject: "AIP Booking for the restaurant successfully!!!", // Subject line
    // html: req.body.content + "<br/>" + "<b>" + "This is HTML body" + "</b>", // html body
    html: bodyEmailTemplate(message), // html body
  };

  let smtpTransport = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "anltnm93@gmail.com", // Your gmail address.
      clientId: clientSecret.web.client_id,
      clientSecret: clientSecret.web.client_secret,
      refreshToken: clientSecret.web.refreshToken,
    }

  });

  smtpTransport.sendMail(messageTemplate, function (error, info) {
    if (error) {
      smtpTransport.close();
      return fail(error);
    } else {
      smtpTransport.close();

      console.log('Message %s sent: %s', info.messageId, info.response);
      return success(info);
    }
  });
}






