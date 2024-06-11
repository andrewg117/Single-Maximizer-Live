import express, { Request, Response } from "express";
import session, { SessionData } from "express-session";
import asyncHandler from "express-async-handler";
const multer = require("multer");
import Image from "../models/imageModel";
import Track from "../models/trackModel";
import { s3, uploadS3Object, deleteS3Object } from "../config/s3helper";

declare module "express" {
  interface Request {
    body: any;
    file?: any;
    files?: any;
  }
}

// @desc    Post image
// @route   POST /api/image
// @access  Private
const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))
  // console.log('File: ' + JSON.stringify(req.file))

  let image: any;

  if (req.body.section === "avatar") {
    image = await Image.create({
      user: req.session.userID,
      section: req.body.section,
      file: req.file,
    });
  } else if (req.body.section === "cover") {
    image = await Image.create({
      user: req.session.userID,
      trackID: req.body.trackID,
      section: req.body.section,
      file: req.file,
    });
  }

  const uploadedImage = await Image.findByIdAndUpdate(
    image._id,
    {
      $set: {
        s3ImageURL:
          "https://singlemax-bucket.s3.amazonaws.com/" + image._id as string,
      },
    },
    {
      new: true,
    }
  );

  const updateTrack = await Track.findByIdAndUpdate(
    image.trackID,
    {
      $set: {
        s3ImageURL: {
          name: image.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + image._id as string,
        },
      },
    },
    {
      new: true,
    }
  );

  const response = await s3.send(
    uploadS3Object(
      uploadedImage._id.toString(),
      req.file.buffer,
      req.file.mimetype
    )
  );

  // console.log("Post: " + response)

  if (image) {
    res.json(image);
  }
});

// @desc    Post press
// @route   POST /api/image/press
// @access  Private
const uploadPress = asyncHandler(async (req, res) => {
  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  // console.log('Body: ' + JSON.stringify(req.body))

  const files = multer.many(req.files, "images");

  files.forEach(async (file: any) => {
    let image;
    // console.log(file.originalname)
    image = await Image.create({
      user: req.session.userID,
      trackID: req.body.trackID,
      section: req.body.section,
      file: file,
    });

    const updatedImage = (await Image.findByIdAndUpdate(
      image._id,
      {
        $set: {
          s3ImageURL:
            "https://singlemax-bucket.s3.amazonaws.com/" + image._id.toString(),
        },
      },
      {
        new: true,
      }
    )) as any;

    const updateTrack = await Track.findByIdAndUpdate(
      req.body.trackID,
      {
        $push: {
          s3PressURL: {
            name: file.originalname,
            url: updatedImage.s3ImageURL,
          },
        },
      },
      {
        new: true,
      }
    );

    const response = await s3.send(
      uploadS3Object(updatedImage._id.toString(), file.buffer, file.mimetype)
    );
  });

  res.json("Files saved");
});

// @desc    Get image
// @route   GET /api/image
// @access  Private
const getImage = asyncHandler(async (req, res) => {
  let image;

  if (req.query.section === "avatar") {
    image = await Image.findOne({
      user: req.session.userID,
      section: "avatar",
    });
  } else if (req.query.section === "cover") {
    image = await Image.findOne({
      trackID: req.query.trackID,
      section: "cover",
    });
  }

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.session.userID) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(image);
});

// @desc    Get press
// @route   GET /api/image/press
// @access  Private
const getPress = asyncHandler(async (req, res) => {
  let image: any;

  image = await Image.find({ trackID: req.query.trackID, section: "press" });

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image[0].user as string !== req.session.userID) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json(image);
});

// @desc    Update image
// @route   PUT /api/image/:file
// @access  Private
const updateImage = asyncHandler(async (req: Request, res: Response) => {
  let image = null;
  if (req.body.section === "avatar") {
    image = await Image.findOne({ user: req.session.userID });
  } else if (req.body.section === "cover") {
    image = await Image.findOne({ trackID: req.body.trackID });
  }

  if (image === null) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.session.userID) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // console.log('Image: ' + track)
  // console.log('Params: ' + JSON.stringify(req.params))
  // console.log('File: ' + JSON.stringify(req.file))
  // console.log('Body: ' + JSON.stringify(req.body))

  const newBody = {
    ...req.body,
    file: req.file,
    s3ImageURL:
      "https://singlemax-bucket.s3.amazonaws.com/" + image._id as string,
  };

  const updatedImage = (await Image.findByIdAndUpdate(image._id, newBody, {
    new: true,
  })) as any;

  const updateTrack = await Track.findByIdAndUpdate(
    image.trackID,
    {
      $set: {
        s3ImageURL: {
          name: req.file.originalname,
          url:
            "https://singlemax-bucket.s3.amazonaws.com/" + image._id as string,
        },
      },
    },
    {
      new: true,
    }
  );

  if(updatedImage) {
    const response = await s3.send(
      uploadS3Object(
        updatedImage?._id.toString(),
        req.file.buffer as string,
        req.file.mimetype as string
      )
    );
  }

  // console.log("Put: " + JSON.stringify(response))

  res.json(updatedImage);
});

// @desc    Delete image
// @route   DELETE /api/image/
// @access  Private
const deleteImage = asyncHandler(async (req, res) => {
  let image = await Image.find({ trackID: req.params.id });

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image[0].user.toString() !== req.session.userID) {
    res.status(401);
    throw new Error("User not authorized");
  }

  image.forEach(async (item: any) => {
    // console.log(item._id)
    const deleteImage = await Image.findByIdAndDelete(item._id);

    const response = await s3.send(deleteS3Object(item._id as string));
  });

  res.json(req.params.id);
});

// @desc    Delete press
// @route   DELETE /api/press/:id
// @access  Private
const deletePress = asyncHandler(async (req, res) => {
  let image;
  image = await Image.findById(req.params.id);

  if (!image) {
    res.status(400);
    throw new Error("Image not found");
  }

  if (!req.session.userID) {
    res.status(401);
    throw new Error("User not found");
  }

  if (image.user.toString() !== req.session.userID) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updateTrack = await Track.findByIdAndUpdate(
    image.trackID,
    {
      $pull: { s3PressURL: { url: image.s3ImageURL } },
    },
    {
      new: true,
    }
  );

  const deleteImage = await Image.findByIdAndDelete(req.params.id);

  const response = await s3.send(deleteS3Object(image._id.toString()));

  res.json(deleteImage?.id);
});

export {
  uploadImage,
  uploadPress,
  getImage,
  getPress,
  updateImage,
  deleteImage,
  deletePress,
};
