import { type Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { type FileRequest } from "../types/controllers/interfaces";
import Audio from "../models/audioModel";
import Track from "../models/trackModel";
import { s3, uploadS3Object, deleteS3Object } from "../config/s3helper";
// import { ObjectId } from "mongoose";

// @desc    Post audio
// @route   GET /api/audio
// @access  Private
const uploadAudio = asyncHandler(
  async (req: FileRequest, res: Response, next) => {
    try {
      if (!req.session.userID) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("User not found");
      }

      // console.log('Body: ' + JSON.stringify(req.body))
      // console.log('File: ' + JSON.stringify(req.file))

      const audio = await Audio.create({
        user: req.session.userID,
        trackID: req.body.trackID,
        file: req.file,
      });

      const updatedAudio = await Audio.findByIdAndUpdate(
        audio._id,
        {
          $set: {
            s3AudioURL:
              "https://singlemax-bucket.s3.us-east-1.amazonaws.com/" +
              audio._id.toString(),
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
                "https://singlemax-bucket.s3.us-east-1.amazonaws.com/" +
                audio._id.toString(),
            },
          },
        },
        {
          new: true,
        }
      );

      if(updatedAudio) {
        const response = await s3.send(
          uploadS3Object(
            updatedAudio?._id.toString(),
            req.file.buffer as string,
            req.file.mimetype as string
          )
        );
      }

      if (audio) {
        res.json(audio);
      }
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Get audio
// @route   GET /api/audio/:id
// @access  Private
const getAudio = asyncHandler(async (req, res, next) => {
  try {
    const audio = await Audio.findOne({ trackID: req.params.id });

    if (!audio) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Audio not found");
    }

    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }

    if (audio.user.toString() !== req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not authorized");
    }

    res.json(audio);
  } catch (error) {
    next(error);
  }
});

// @desc    Update audio
// @route   PUT /api/audio/:file
// @access  Private
const updateAudio = asyncHandler(
  async (req: FileRequest, res: Response, next) => {
    try {
      const audio = await Audio.findOne({ trackID: req.body.trackID });

      if (!audio) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Tacrk not found");
      }

      if (!req.session.userID) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("User not found");
      }

      if (audio.user.toString() !== req.session.userID) {
        res.status(StatusCodes.UNAUTHORIZED);
        throw new Error("User not authorized");
      }

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
              name: req.file?.originalname,
              url:
                "https://singlemax-bucket.s3.us-east-1.amazonaws.com/" +
                audio._id.toString(),
            },
          },
        },
        {
          new: true,
        }
      );

      const delResponse = await s3.send(deleteS3Object(audio._id.toString()));
      console.log(delResponse)

      const putResponse = await s3.send(
        uploadS3Object(audio._id.toString(), req.file?.buffer, req.file?.mimetype)
      );

      res.json(updatedAudio);
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Delete audio
// @route   DELETE /api/audio/:id
// @access  Private
const deleteAudio = asyncHandler(async (req, res, next) => {
  try {
    const audio = await Audio.findOne({ trackID: req.params.id });

    if (!audio) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Audio not found");
    }

    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }

    if (audio.user.toString() !== req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not authorized");
    }

    const deleteAudio = await Audio.findByIdAndDelete(audio._id);

    const response = await s3.send(deleteS3Object(audio._id.toString()));

    res.json(deleteAudio?.id);
  } catch (error) {
    next(error);
  }
});

export { uploadAudio, getAudio, updateAudio, deleteAudio };
