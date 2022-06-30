const User = require("../model/client");
const Token = require("../model/user_token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);
const emailClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

exports.signup = async function (req, res) {
  try {
    // // checking if user is already in the database
    // const emailExist = await User.findOne({ email: req.body.email });

    // if (emailExist)
    //   return res.status(400).json({ message: "Email already exist" });

    // lets validate the data before use
    const validatePassword = (password) => {
      const re =
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/;
      return re.test(password);
    };
    if (!validatePassword(req.body.password)) {
      return res.status(400).send({
        error:
          "Password must contain at least 8 characters including uppercase, lowercase and special characters",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const theUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await theUser.save();

    const generatedToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const token = await generatedToken.save();

    const messageData = {
      from: "CLIENT <me@samples.mailgun.org>",
      to: req.body.email,
      subject: "Verification Email",
      text: `Hey ${req.body.name}, it’s our first message saying welcome`,
      html: `<b>Hey ${req.body.name}! </b><br> Kindly verify your account by clicking the link <a href="http://${req.headers.host}/verify/${token.token}">here</a>`,
    };
    emailClient.messages
      .create(process.env.MAILGUN_DOMAIN, messageData)
      .then((resp) => {
        res.send({
          message: "Success" + resp.message,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    return { error: e };
  }
};

exports.token = async function (req, res) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    // token is not found into database i.e. token may have expired
    if (!token) {
      return res.status(400).send({
        msg: "Your verification link may have expired. Please click on resend for verify your Email.",
      });
    }
    // if token is found then check valid user
    else {
      User.findOne({ _id: token.userId }, function (err, user) {
        // not valid user
        if (!user) {
          return res.status(401).send({
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });
        }
        // user is already verified
        else if (user.isVerified) {
          return res
            .status(200)
            .send("User has been already verified. Please Login");
        }
        // verify user
        else {
          // change isVerified to true
          user.isVerified = true;
          user.save(function (err) {
            // error occur
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            // account successfully verified
            else {
              return res.status(200).send({
                message: "Your account has been successfully verified",
              });
            }
          });
        }
      });
    }
  });
};

//the login
exports.login = async function (req, res) {
  //checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Email is not found");

  //password check
  const validPass = await bcrypt.compareSync(req.body.password, user.password);
  console.log(!validPass);
  if (!validPass)
    return res.status(400).send({
      status: "error",
      message: "invalid password",
    });
  // check user is verified or not
  else if (!user.isVerified) {
    return res.status(401).send({
      msg: "Your Email has not been verified. Please click on resend",
    });
  }

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.status(200).send({ user: user, token: token });
};
