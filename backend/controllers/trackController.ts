// import session, { SessionData } from "express-session";
import asyncHandler from "express-async-handler";
import Track from "../models/trackModel";
import User from "../models/userModel";
import Distro from "../models/distroModel";
import { StatusCodes } from "http-status-codes";
// import { UserRequest } from "../types/interfaces";

// @desc    Get tracks
// @route   GET /api/track
// @access  Private
const getTracks = asyncHandler(async (req, res, next) => {
  try {
    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }
    const tracks = await Track.find({ user: req.session.userID });

    res.json(tracks);
  } catch (error) {
    next(error);
  }
});

// @desc    Get track
// @route   GET /api/track/:id
// @access  Private
const getSingle = asyncHandler(async (req, res, next) => {
  try {
    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }
    const track = (await Track.findById(req.params.id)) as any;

    if (!track) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Track not found");
    }

    if (track.user.toString() !== req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not authorized");
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
});

// TODO: Send email when creating new single

// @desc    Set track
// @route   POST /api/track
// @access  Private
const setTrack = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.trackTitle) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Add track title");
    }

    const track = await Track.create({
      trackTitle: req.body.trackTitle,
      artist: req.body.artist,
      deliveryDate: req.body.deliveryDate,
      spotify: req.body.spotify,
      features: req.body.features,
      apple: req.body.apple,
      producer: req.body.producer,
      scloud: req.body.scloud,
      album: req.body.album,
      trackLabel: req.body.trackLabel,
      ytube: req.body.ytube,
      albumDate: req.body.albumDate || null,
      genres: req.body.genres,
      trackSum: req.body.trackSum,
      pressSum: req.body.pressSum,
      isDelivered: false,
      s3PressURL: [],
      user: req.session.userID,
    });

    res.json(track);
  } catch (error) {
    next(error);
  }
});

// @desc    Update track
// @route   PUT /api/tracks/:id
// @access  Private
const updateTrack = asyncHandler(async (req, res, next) => {
  try {
    const track = (await Track.findById(req.params.id)) as any;

    if (!track) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Tacrk not found");
    }

    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }

    if (track.user.toString() !== req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not authorized");
    }

    const updatedTrack = await Track.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedTrack);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res, next) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("Track not found");
    }

    // const user = await User.findById(req.user.id)

    if (!req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not found");
    }

    if (track.user.toString() !== req.session.userID) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error("User not authorized");
    }

    interface trackObject {
      id: String;
    }

    const deleteTrackData: trackObject = (await Track.findByIdAndDelete(
      req.params.id
    )) as any;

    const updateUser = await User.findByIdAndUpdate(
      req.session.userID,
      {
        $inc: { trackAllowance: 1 },
      },
      {
        new: true,
      }
    );

    res.json(deleteTrackData.id);
  } catch (error) {
    next(error);
  }
});

// @desc    Get genres
// @route   GET /api/genres
// @access  Private
const getGenres = asyncHandler(async (req, res, next) => {
  try {
    const genres = await Distro.distinct("tags");

    const newGrenres = genres.filter((genre) => genre !== "General");

    res.status(StatusCodes.OK).json(newGrenres);
  } catch (error) {
    next(error);
  }
});

export { getTracks, getSingle, setTrack, updateTrack, deleteTrack, getGenres };
