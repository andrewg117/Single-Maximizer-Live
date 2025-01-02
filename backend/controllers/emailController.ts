import session from "express-session";
import asyncHandler from "express-async-handler";
import { Buffer } from "buffer";
import formData from "form-data";
import Mailgun from "mailgun.js";
import axios from "axios";
import { decodeEmail, type emailType } from "../utils/encodeData";
import "../types/controllers/modules";
import Email from "../models/emailModel";
import Track from "../models/trackModel";
import User from "../models/userModel";
import Image from "../models/imageModel";
import Audio from "../models/audioModel";
import Distro from "../models/distroModel";
const EMAILTO = process.env.EMAILTO as string;
const EMAILUSER = process.env.EMAILUSER as string;
const MAILGUN_API = process.env.MAILGUN_API as string;

// Mailgun email setup
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API });
const mgDomain = "mail.trackstarz.com";

interface emailOptionsType {
  fromEmail: string;
  toEmail: string;
  bccEmails: string[];
  subject: string;
  htmlBody: string;
  attachments: Array<{ filename: string; data: any }>;
}

const emailSetup = ({
  fromEmail,
  toEmail,
  bccEmails,
  subject,
  htmlBody,
  attachments,
}: emailOptionsType) => {
  const mailOptions = {
    from: '"TRACKSTARZ" ' + fromEmail, // sender address
    to: toEmail, // list of receivers
    bcc: bccEmails, // TODO: Add distribution email list
    subject: subject, // Subject line
    html: htmlBody, // html body
    attachment: attachments,
  };

  mg.messages
    .create(mgDomain, mailOptions)
    .then(async (msg) => {
      console.log(msg);

      // TODO: Uncomment on production
      // const updatedTrack = await Track.findByIdAndUpdate(
      //   singleDoc.id,
      //   { isDelivered: true },
      //   {
      //     new: true,
      //   }
      // );
    })
    .catch((err) => console.log(err));
};

// General email
const generalEmail = async (
  singleDoc: any,
  subjectType: string,
  distroList: string[]
) => {
  //#region Email Body Content
  let emailContent: string;

  const userDoc = (await User.findById(singleDoc.user)) as any;
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
  //#endregion

  let getAttachments: Array<{ filename: string; data: any }> = [];

  await Image.find({ trackID: singleDoc._id, section: "press" }).then(
    (press) => {
      press.forEach((image: any) => {
        let buffer = Buffer.from(
          image.file.buffer.toString("base64"),
          "base64"
        );
        getAttachments.push({
          filename: image.file.originalname,
          data: buffer,
        });
      });
    }
  );

  singleDoc.s3PressURL.forEach(async (press: any) => {
    emailContent += `<p>${press.url || ""}</p>`;

    // const image = await axios.get(press.url, { responseType: "stream" });

    // getAttachments.push({
    //   filename: press.name,
    //   data: image.data,
    // });
  });

  let subjectLine;
  switch (subjectType) {
    case "mizfitz":
      subjectLine = `Artist Music Submission - ${singleDoc.artist}`;
      break;
    case "hopnation":
      subjectLine = `Podcast Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "brooklynradio":
      subjectLine = `Music Submission: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "default":
      subjectLine = `${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    default:
      subjectLine = `${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
  }

  // const audioURL = singleDoc.s3AudioURL
  //   ? await axios.get(singleDoc.s3AudioURL.url, { responseType: "stream" })
  //   : null;
  // const imageURL = singleDoc.s3ImageURL
  //   ? await axios.get(singleDoc.s3ImageURL.url, { responseType: "stream" })
  //   : null;

  // audioURL
  //   ? getAttachments.push({
  //       filename: singleDoc.s3AudioURL.name,
  //       data: audioURL.data,
  //     })
  //   : null;
  let audioFile: any = await Audio.findOne({ trackID: singleDoc._id });
  let audioBuffer = Buffer.from(
    audioFile.file.buffer.toString("base64"),
    "base64"
  );
  getAttachments.push({
    filename: audioFile.file.originalname,
    data: audioBuffer,
  });

  let trackCover: any = await Image.findOne({
    trackID: singleDoc._id,
    section: "cover",
  });
  let coverBuffer = Buffer.from(
    trackCover.file.buffer.toString("base64"),
    "base64"
  );
  getAttachments.push({
    filename: trackCover.file.originalname,
    data: coverBuffer,
  });
  // imageURL
  //   ? getAttachments.push({
  //       filename: singleDoc.s3ImageURL.name,
  //       data: imageURL.data,
  //     })
  //   : null;

  // TODO: Change to return email options
  const emailOptions: emailOptionsType = {
    fromEmail: EMAILUSER,
    toEmail: userDoc.email,
    bccEmails: [], // TODO: Add distribution email list
    subject: subjectLine as string,
    htmlBody: emailContent,
    attachments: getAttachments,
  };

  emailSetup(emailOptions);
};

// Alternate email
const altEmail = async (
  singleDoc: any,
  subjectType: string,
  distroList: string[]
) => {
  const userDoc = (await User.findById(singleDoc.user)) as any;

  //#region Email Body Content
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

  let getAttachments: Array<{ filename: string; data: any }> = [];

  singleDoc.s3PressURL.forEach(async (press: any) => {
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

  // #endregion

  let subjectLine;
  switch (subjectType) {
    case "rapzilla":
      subjectLine = `New Stream: ${singleDoc.artist} - ${singleDoc.trackTitle}`;
      break;
    case "kdhx":
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

  // TODO: Change to return email options
  const emailOptions: emailOptionsType = {
    fromEmail: EMAILUSER,
    toEmail: userDoc.email,
    bccEmails: [], // TODO: Add distribution email list
    subject: subjectLine as string,
    htmlBody: emailContent,
    attachments: getAttachments,
  };

  emailSetup(emailOptions);
};

// Get Distribution by genre
const getDistributionList = async (genres: string[]) => {
  debugger;
  let distroCount: object[] = [];
  let totalCount: number = 0;
  let emailArray: any[] = [];
  for (const genre of genres) {
    let ditroMatch: any = await Distro.find({ tags: genre });
    totalCount += ditroMatch.length;

    for (const distro of ditroMatch) {
      emailArray.push(decodeEmail(distro.email as emailType));
    }

    distroCount.push({
      genre: genre,
      emails: ditroMatch.length,
    });
  }

  let uniqueEmails = emailArray.filter(
    (item, index) => emailArray.indexOf(item) === index
  );
  // console.log("Total emails: " + emailArray.length);
  // console.log("Unique emails: " + uniqueEmails.length);

  // console.log(distroCount);

  return uniqueEmails;
};

const getAltDistributionList = (distroList: string[], companyRegex: RegExp) => {
  const altDistroList: string[] = [];

  distroList.forEach((email: string) => {
    // Find alt distros
    if (companyRegex.test(email.toLocaleLowerCase())) {
      altDistroList.push(email);
    }
  });

  return altDistroList;
};

// @desc    Send Scheduled Email
const sendScheduledEmail = async () => {
  // Updates tracks to be delivered
  // COMPLETE: Fix delivery time
  // Server time changed from UTC to EST

  const curDate = new Date();
  curDate.setUTCHours(23, 59, 59, 999);

  let tracks = await Track.find({
    // deliveryDate: { $lt: curDate }, // TODO: Uncomment on production
    isDelivered: false,
  });

  for (const track in tracks) {
    const singleDoc: any = tracks[track];

    const StandardGenres: string[] = singleDoc.genres;
    StandardGenres.push("General");

    const distroList: string[] = await getDistributionList(StandardGenres);

    const altDistroList: string[] = getAltDistributionList(
      distroList,
      /mizfitz|hopnation|kdhx|rapzilla|brooklynradio/
    );

    let filteredDistroList: string[] = distroList.filter(
      (email: string) => !altDistroList.includes(email)
    );

    // console.log("Alt distros: " + altDistroList.length);
    const mizfitzDistroList: string[] = getAltDistributionList(
      altDistroList,
      /mizfitz/
    );

    const hopnationDistroList: string[] = getAltDistributionList(
      altDistroList,
      /hopnation/
    );

    const brooklynRadioDistroList: string[] = getAltDistributionList(
      altDistroList,
      /brooklynradio/
    );

    console.log("brooklynradio: " + brooklynRadioDistroList.length);

    const rapzillaDistroList: string[] = getAltDistributionList(
      altDistroList,
      /rapzilla/
    );
    const kdhxDistroList: string[] = getAltDistributionList(
      altDistroList,
      /kdhx/
    );

    // generalEmail(singleDoc, "default", filteredDistroList);
    // mizfitzDistroList.length > 0 &&
    //   generalEmail(singleDoc, "mizfitz", mizfitzDistroList);
    // hopnationDistroList.length > 0 &&
    //   generalEmail(singleDoc, "hopnation", hopnationDistroList);
    // brooklynRadioDistroList.length > 0 &&
    //   generalEmail(singleDoc, "brooklynradio", brooklynRadioDistroList); // 
    // rapzillaDistroList.length > 0 &&
    //   altEmail(singleDoc, "rapzilla", rapzillaDistroList);
    // kdhxDistroList.length > 0 && altEmail(singleDoc, "kdhx", kdhxDistroList);
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
    user: req.session.userID,
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

  // console.log("Message sent: %s", info.messageId);

  res.json(email);
  res.status(200);
});

export { sendEmail, sendScheduledEmail };
