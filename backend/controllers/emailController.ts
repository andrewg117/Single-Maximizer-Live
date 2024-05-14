const Email = require("../models/emailModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const axios = require("axios");
// TODO: Get email list for EMAILTO
const EMAILTO = process.env.EMAILTO;
const EMAILUSER = process.env.EMAILUSER;
const MAILGUN_API = process.env.MAILGUN_API;

// Mailgun email setup
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API });
const mgDomain = "mail.trackstarz.com";

// General email
const generalEmail = async (singleDoc, subjectType) => {
  let emailContent;

  const userDoc = await User.findById(singleDoc.user);
  emailContent = `<p>Artist: ${singleDoc.artist || ""}</p>`;

  emailContent += `<p>Featured Artist(s): ${singleDoc.features || ""}</p>`;
  emailContent += `<p>Song: ${singleDoc.trackTitle || ""}</p>`;
  emailContent += `<p>Producer: ${singleDoc.producer || ""}</p>`;
  emailContent += `<p>Album: ${singleDoc.album || ""}</p>`;
  emailContent += `<p>Album Release Date: ${
    singleDoc.albumDate
      ?.toLocaleString("default", { timeZone: "UTC" })
      .split(",")[0] || ""
  }</p>`;
  emailContent += `<p>Label: ${singleDoc.trackLabel || ""}</p>`;
  emailContent += `<br><br>`;
  emailContent += `<p>Bio: </p><p>${userDoc.bio_text || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Website: ${userDoc.website || ""}</p>`;
  emailContent += `<p>Twitter: ${userDoc.twitter || ""}</p>`;
  emailContent += `<p>Facebook: ${userDoc.fbook || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Soundcloud: ${singleDoc.scloud || ""}</p>`;
  emailContent += `<p>YouTube: ${singleDoc.ytube || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Song Link: ${singleDoc?.s3AudioURL?.url || ""}</p>`;
  emailContent += `<p>Cover Link: ${singleDoc?.s3ImageURL?.url || ""}</p>`;

  emailContent += `<p>Press Photo Link(s): </p>`;

  let getAttachments = [];

  singleDoc.s3PressURL.forEach(async (press) => {
    emailContent += `<p>${press.url || ""}</p>`;

    const image = await axios.get(press.url, { responseType: "stream" });

    getAttachments.push({
      filename: press.name,
      data: image.data,
    });
  });

  let subjectLine;
  switch (subjectType) {
    case "default":
      subjectLine = `${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "Mizfitz":
      subjectLine = `Artist Music Submission - ${singleDoc.artist}`;
      break;
    case "Hop Nation":
      subjectLine = `Podcast Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "Brooklyn Radio":
      subjectLine = `Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
  }

  const audioURL = singleDoc.s3AudioURL
    ? await axios.get(singleDoc.s3AudioURL.url, { responseType: "stream" })
    : null;
  const imageURL = singleDoc.s3ImageURL
    ? await axios.get(singleDoc.s3ImageURL.url, { responseType: "stream" })
    : null;

  audioURL
    ? getAttachments.push({
        filename: singleDoc.s3AudioURL.name,
        data: audioURL.data,
      })
    : null;

  imageURL
    ? getAttachments.push({
        filename: singleDoc.s3ImageURL.name,
        data: imageURL.data,
      })
    : null;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: userDoc.email, // list of receivers
    // to: EMAILTO, // list of receivers
    // bcc: userDoc.email,
    subject: subjectLine, // Subject line
    html: emailContent, // html body
    attachment: getAttachments,
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then(async (msg) => {
      console.log(msg);

      const updatedTrack = await Track.findByIdAndUpdate(
        singleDoc.id,
        { isDelivered: true },
        {
          new: true,
        }
      );
    })
    .catch((err) => console.log(err));
};

// Alternate email
const altEmail = async (singleDoc, subjectType) => {
  const userDoc = await User.findById(singleDoc.user);

  let emailContent = `<p>Artist: ${singleDoc.artist || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Song: ${singleDoc.trackTitle || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Featured: ${singleDoc.features || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Producer: ${singleDoc.producer || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Album: ${singleDoc.album || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Twitter: ${userDoc.twitter || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Spotify Link: ${userDoc.spotify || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Download Link: ${singleDoc?.s3AudioURL?.url || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<p>Cover Link: ${singleDoc?.s3ImageURL?.url || ""}</p>`;
  emailContent += `<br>`;
  emailContent += `<br>`;
  emailContent += `<p>Press Photos: </p>`;

  let getAttachments = [];

  singleDoc.s3PressURL.forEach(async (press) => {
    emailContent += `<p>${press.url || ""}</p>`;

    const image = await axios.get(press.url, { responseType: "stream" });

    getAttachments.push({
      filename: press.name,
      data: image.data,
    });
  });

  emailContent += `<br>`;
  emailContent += `<br>`;
  emailContent += `<p>Bio: </p><p>${userDoc.bio_text || ""}</p>`;

  let subjectLine;
  switch (subjectType) {
    case "Rapzilla":
      subjectLine = `New Stream: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "KDHX":
      subjectLine = `Digital Submission - ${singleDoc.artist} - ${singleDoc.trackTitle}`;
  }

  const audioURL = singleDoc.s3AudioURL
    ? await axios.get(singleDoc.s3AudioURL.url, { responseType: "stream" })
    : null;
  const imageURL = singleDoc.s3ImageURL
    ? await axios.get(singleDoc.s3ImageURL.url, { responseType: "stream" })
    : null;

  audioURL
    ? getAttachments.push({
        filename: singleDoc.s3AudioURL.name,
        data: audioURL.data,
      })
    : null;

  imageURL
    ? getAttachments.push({
        filename: singleDoc.s3ImageURL.name,
        data: imageURL.data,
      })
    : null;

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: EMAILTO, // list of receivers
    bcc: userDoc.email,
    subject: subjectLine, // Subject line
    html: emailContent, // html body
    attachment: getAttachments,
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then(async (msg) => {
      console.log(msg);

      // const updatedTrack = await Track.findByIdAndUpdate(singleDoc.id, { isDelivered: true }, {
      //   new: true
      // })
    })
    .catch((err) => console.log(err));
};

// @desc    Send Scheduled Email
const sendScheduledEmail = async () => {
  // Updates tracks to be delivered
  // COMPLETE: Fix delivery time
  // Server time changed from UTC to EST

  const curDate = new Date();
  curDate.setUTCHours(23, 59, 59, 999);

  let tracks = await Track.find({
    deliveryDate: { $lt: curDate },
    isDelivered: false,
  });

  for (const track in tracks) {
    const singleDoc = tracks[track];

    generalEmail(singleDoc, "default");
    // generalEmail(singleDoc, 'Mizfitz')
    // generalEmail(singleDoc, 'Hop Nation')
    // generalEmail(singleDoc, 'Brooklyn Radio')
    // altEmail(singleDoc, 'Rapzilla')
    // altEmail(singleDoc, 'KDHX')
  }
};

// @desc    Send Email
// @route   POST /api/send
// @access  Private
const sendEmail = asyncHandler(async (req, res) => {
  if (!req.body.recipient) {
    res.status(400);
    throw new Error("Add recipient");
  } else if (!req.body.subject) {
    res.status(400);
    throw new Error("Add subject");
  } else if (!req.body.emailMessage) {
    res.status(400);
    throw new Error("Add message");
  }

  const email = await Email.create({
    recipient: req.body.recipient,
    subject: req.body.subject,
    emailMessage: req.body.emailMessage,
    user: req.user.id,
    trackID: req.body.trackID,
    deliveryDate: req.body.deliveryDate,
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"TRACKSTARZ" ' + EMAILUSER, // sender address
    to: req.body.recipient, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.emailMessage, // plain text body
    html: `<p>${req.body.emailMessage}</p>`, // html body
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));

  console.log("Message sent: %s", info.messageId);

  res.json(email);
  res.status(200);
});

module.exports = {
  sendEmail,
  sendScheduledEmail,
};
