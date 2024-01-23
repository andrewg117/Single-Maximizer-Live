import axios from "axios";

const API_URL = "/api/purchase/";

const makePurchase = async () => {
  let response;
  response = await axios.post(API_URL);

  return response.data;
};

const getPurchase = async () => {
  let response;
  response = await axios.get(API_URL);

  return response.data;
};

const purchaseService = {
  makePurchase,
  getPurchase,
};

export default purchaseService;
