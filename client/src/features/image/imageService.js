import axios from "axios";

const API_URL = "/api/image/";

const postImage = async (imageData) => {
  let response;

  response = await axios.post(API_URL, imageData);

  return response.data;
};

const postPress = async (pressData) => {
  let response;

  response = await axios.post(API_URL + "press", pressData);

  return response.data;
};

const getImage = async (imageData) => {
  const config = {
    params: {
      ...imageData,
    },
  };

  let response;
  response = await axios.get(API_URL, config);

  return response.data;
};

const getPress = async (pressData) => {
  const config = {
    params: {
      ...pressData,
    },
  };

  let response;
  response = await axios.get(API_URL + "press", config);

  return response.data;
};

const updateImage = async (imageData) => {
  let response;

  response = await axios.put(API_URL + imageData, imageData);

  return response.data;
};

const deleteImage = async (trackID) => {
  let response;

  response = await axios.delete(API_URL + trackID);

  return response.data;
};

const deletePress = async (trackID) => {
  let response;

  response = await axios.delete(API_URL + "press/" + trackID);

  return response.data;
};

const imageService = {
  postImage,
  postPress,
  getImage,
  getPress,
  updateImage,
  deleteImage,
  deletePress,
};

export default imageService;
