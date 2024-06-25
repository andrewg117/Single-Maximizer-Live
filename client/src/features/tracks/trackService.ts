import axios from "axios";

const API_URL = "/api/tracks/";

const createTrack = async (trackData: any) => {
  let response;

  response = await axios.post(API_URL, trackData);

  return response.data;
};

const getTrack = async () => {
  let response;

  response = await axios.get(API_URL);

  return response.data;
};

const getSingle = async (trackId: any) => {
  let response;

  response = await axios.get(API_URL + trackId);

  return response.data;
};

const updateSingle = async (trackID: any, trackData: any) => {
  let response;

  response = await axios.put(API_URL + trackID, trackData);

  return response.data;
};

const deleteTrack = async (trackId: any) => {
  let response;

  response = await axios.delete(API_URL + trackId);

  return response.data;
};

const trackService = {
  createTrack,
  getTrack,
  getSingle,
  updateSingle,
  deleteTrack,
};

export default trackService;
