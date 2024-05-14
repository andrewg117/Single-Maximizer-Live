const Audio = require("../models/audioModel");
const Track = require("../models/trackModel");
const { s3, uploadS3Object, deleteS3Object } = require("../config/s3helper");
const asyncHandler = require("express-async-handler");

// @desc    Post audio
// @route   GET /api/audio
// @access  Private
const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  const audio = await Audio.create({
    user: req.user.id,
    trackID: req.body.trackID,
    file: req.file,
  });

  const updatedAudio = await Audio.findByIdAndUpdate(
    audio._id,
    {
      $set: {
        s3AudioURL:
          "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
      },
    },
    {
      new: true,
    }
  );

  const updateTrack = await Track.findByIdAndUpdate(
    audio.trackID,
    {
      $set: {
        s3AudioURL: {
          name: req.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
        },
      },
    },
    {
      new: true,
    }
  );

  const response = await s3.send(
    uploadS3Object(
      updatedAudio._id.toString(),
      req.file.buffer,
      req.file.mimetype
    )
  );

  if (audio) {
    res.json(audio);
  }
});

// @desc    Get audio
// @route   GET /api/audio/:id
// @access  Private
const getAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.params.id });

  if (!audio) {
    res.status(400);
    throw new Error("Audio not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(audio);
});

// @desc    Update audio
// @route   PUT /api/audio/:file
// @access  Private
const updateAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.body.trackID });

  if (!audio) {
    res.status(400);
    throw new Error("Tacrk not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // console.log('Audio: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.files))
  // console.log('Body: ' + JSON.stringify(req.body))

  const newBody = {
    ...req.body,
    file: req.file,
  };

  const updatedAudio = await Audio.findByIdAndUpdate(audio._id, newBody, {
    new: true,
  });

  const updateTrack = await Track.findByIdAndUpdate(
    audio.trackID,
    {
      $set: {
        s3AudioURL: {
          name: req.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + audio._id.toString(),
        },
      },
    },
    {
      new: true,
    }
  );

  const delResponse = await s3.send(deleteS3Object(audio._id.toString()));
  // console.log(delResponse)

  const putResponse = await s3.send(
    uploadS3Object(audio._id.toString(), req.file.buffer, req.file.mimetype)
  );

  res.json(updatedAudio);
});

// @desc    Delete audio
// @route   DELETE /api/audio/:id
// @access  Private
const deleteAudio = asyncHandler(async (req, res) => {
  const audio = await Audio.findOne({ trackID: req.params.id });

  if (!audio) {
    res.status(400);
    throw new Error("Audio not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (audio.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const deleteAudio = await Audio.findByIdAndDelete(audio._id);

  const response = await s3.send(deleteS3Object(audio._id.toString()));

  res.json(deleteAudio.id);
});

module.exports = {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
};
