import axios from "axios";
const API_URL = "/api/audio/";

export interface audioType extends Object {
  trackID: string;
  s3AudioURL: String;
  section: String;
  file: any;
}

const postAudio = async (audioData: any) => {
  let response: audioType | any;

  await axios
    .post(API_URL, audioData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as audioType;
};

const getAudio = async (trackId: any) => {
  let response: audioType | any;

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

  return response as audioType;
};

const updateAudio = async (audioData: any) => {
  let response: audioType | any;

  await axios
    .put(API_URL + audioData, audioData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as audioType;
};

const deleteAudio = async (trackId: any) => {
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

const audioService = {
  postAudio,
  getAudio,
  updateAudio,
  deleteAudio,
};

export default audioService;
