import axios from "axios";

const API_URL = "/api/tracks/";

export interface singleType extends Object {
  user: string;
  trackTitle: string;
  artist: string;
  deliveryDate?: Date;
  spotify?: string;
  features?: string;
  label?: string;
  apple?: string;
  producer?: string;
  scloud?: string;
  album?: string;
  trackLabel?: string;
  ytube?: string;
  albumDate?: Date;
  genres?: Array<string>;
  trackSum?: string;
  pressSum?: string;
  isDelivered?: Boolean;
  s3ImageURL?: string;
  s3AudioURL?: string;
  s3PressURL?: Array<string>;
}

const createTrack = async (trackData: any) => {
  let response: singleType | any;

  await axios
    .post(API_URL, trackData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as singleType;
};

const getTrack = async () => {
  let response: Array<singleType> | any;

  await axios
    .get(API_URL)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as Array<singleType>;
};

const getSingle = async (trackId: any) => {
  let response: singleType | any;

  await axios
    .get(API_URL + trackId)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as singleType;
};

const updateSingle = async (trackID: any, trackData: any) => {
  let response: singleType | any;

  await axios
    .put(API_URL + trackID, trackData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as singleType;
};

const deleteTrack = async (trackId: any) => {
  let response;

  await axios
    .delete(API_URL + trackId)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response;
};

const getGenres = async () => {
  let response: Array<string> | any;

  await axios
    .get(API_URL + "genres")
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as Array<string>;
};

const trackService = {
  createTrack,
  getTrack,
  getSingle,
  updateSingle,
  deleteTrack,
  getGenres,
};

export default trackService;
