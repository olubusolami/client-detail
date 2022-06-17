const { getMaxListeners } = require("../model/client");

const emailConfig = require("./email-config")();
const mailgun = require("mailgun-js")(emailConfig);

// Try and modify this code to make sure your mail is sending

exports.sendEmail = async function (req, res) {
  mailgun.
  messages().
  send({
    from: "Mailgun Sandbox <postmaster@sandbox35342bd9418e47edad1d77971c53f3e3.mailgun.org>",
      to: 'belloridwan60@gmail.com',
      subject: 'Hello from Mailgun',
      text: 'This is a test'
  }).
  then(res => {
    // console.log(res)
    return res.status(200).json("yes")
  }).
  catch(err => {
    return res.send(err)
  });
}

  // new Promise((resolve, reject) => {
  //   const data = {
  //     from: "CLIENT <me@samples.mailgun.org>",
  //     to: recipient,
  //     subject: "Account Verification Link",
  //     text: `Hey ${recipient}, it’s our first message sent with mailgun`, // This is for normal text display while the html is to format the text in an html format
  //     // html: `<b>Hey ${recipient.name}! </b><br> Kindly verify your account by clicking the link <a href="http://${recipeint.host}/verify/${token.token}">here</a>`,
  //   };

  //   mailgun.messages().send(data, (error) => {
  //     res.send("hello")
  //     if (error) {
  //       // return reject(error);
  //     }
  //     // return resolve();
  //   });
  // }
  // // });
