import axios from "axios";

const API_URL = "/api/audio/";

const postAudio = async (audioData: any) => {
  let response;

  response = await axios.post(API_URL, audioData);

  return response.data;
};

const getAudio = async (trackId: any) => {
  let response;

  response = await axios.get(API_URL + trackId);

  return response.data;
};

const updateAudio = async (audioData: any) => {
  let response;

  response = await axios.put(API_URL + audioData, audioData);

  return response.data;
};

const deleteAudio = async (trackId: any) => {
  let response;

  response = await axios.delete(API_URL + trackId);

  return response.data;
};

const audioService = {
  postAudio,
  getAudio,
  updateAudio,
  deleteAudio,
};

export default audioService;
