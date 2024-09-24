import axios from "axios";

const API_URL = "/api/image/";

export interface imageType extends Object {
  trackID: string;
  s3ImageURL: String;
  section: String;
  file: any;
}

const postImage = async (imageData: any) => {
  let response: imageType | any;

  await axios
    .post(API_URL, imageData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as imageType;
};

const postPress = async (pressData: any) => {
  let response;

  await axios
    .post(API_URL + "press", pressData)
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

const getImage = async (imageData: any) => {
  const config = {
    params: {
      ...imageData,
    },
  };

  let response: imageType | any;
  await axios
    .get(API_URL, config)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as imageType;
};

const getPress = async (pressData: { trackID: string }) => {
  const config = {
    params: {
      ...pressData,
    },
  };

  let response: Array<imageType> | any;

  await axios
    .get(API_URL + "press", config)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as Array<imageType>;
};

const updateImage = async (imageData: FormData) => {
  let response: imageType | any;

  await axios
    .put(API_URL + imageData, imageData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response as imageType;
};

const deleteImage = async (trackID: any) => {
  let response;

  response = await axios
    .delete(API_URL + trackID)
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

const deletePress = async (trackID: any) => {
  let response;

  await axios
    .delete(API_URL + "press/" + trackID)
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
