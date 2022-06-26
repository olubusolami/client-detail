const { getMaxListeners } = require("../model/client");

const emailConfig = require("./email-config")();
const mailgun = require("mailgun-js")(emailConfig);

exports.sendEmail = (recipient, message = "", attachment = "") =>
  new Promise((resolve, reject) => {
    const data = {
      from: "Mailgun Sandbox <postmaster@sandbox35342bd9418e47edad1d77971c53f3e3.mailgun.org>",
      to: recipient,
      subject: "Account Verification Link",
      text: `Hey ${recipient}, it’s our first message sent with mailgun`, // This is for normal text display while the html is to format the text in an html format
      // html: `<b>Hey ${recipient.name}! </b><br> Kindly verify your account by clicking the link <a href="http://${recipeint.host}/verify/${token.token}">here</a>`,
    };

    mailgun.messages().send(data, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });