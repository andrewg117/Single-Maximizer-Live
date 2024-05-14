const {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const dotenv = require("dotenv").config();
const port = process.env.Port || 5000;
const AWS_ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const AWS_DEFAULT_REGION = process.env.DEFAULT_REGION;

let s3 = new S3Client({
  region: AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  // endpoint: "http://localhost:5000",
  // forcePathStyle: true,
});

const searchBucket = new ListObjectsCommand({
  Bucket: "singlemax-bucket",
  // MaxKeys: 1,
});

// URL examples
// https://singlemax-bucket.s3.us-east-1.amazonaws.com/single-Maximizer-tile.png
// https://s3.us-east-1.amazonaws.com/singlemax-bucket/single-Maximizer-tile.png

// meta-data examples: x-amz-meta-
// x-amz-meta-userID, x-amz-meta-trackID

const getObject = new GetObjectCommand({
  Bucket: "singlemax-bucket",
  Key: "hello-s3.txt",
  ETag: "fcefc42e049921a12611b2c421141919",
  // MaxKeys: 1,
});

const uploadS3Object = (fileName, fileBody, mimetype) => {
  return new PutObjectCommand({
    Bucket: "singlemax-bucket",
    Key: fileName,
    Body: fileBody,
    ContentType: mimetype,
  });
};

const deleteS3Object = (fileName) => {
  return new DeleteObjectCommand({
    Bucket: "singlemax-bucket",
    Key: fileName,
  });
};

const runS3Commands = async () => {
  try {
    // let {Contents} = await s3.send(searchBucket)
    // console.log(Contents)

    // const response = await s3.send(uploadS3Object)
    // console.log(response)

    const response = await s3.send(getObject);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  s3,
  runS3Commands,
  uploadS3Object,
  deleteS3Object,
};
