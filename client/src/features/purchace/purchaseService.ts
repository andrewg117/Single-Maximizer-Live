import axios from "axios";

const API_URL = "/api/purchase/";

const makePurchase = async () => {
  let response;
  response = await axios.post(API_URL);

  return response.data;
};

const makeEmbeddedPurchase = async () => {
  let response;
  response = await axios.post(API_URL + "checkout");

  return response.data;
};

const getCheckoutStatus = async (session_id: string) => {
  let response;
  response = await axios.get(API_URL + "checkout" + session_id);

  return response.data;
};



const purchaseService = {
  makePurchase,
  makeEmbeddedPurchase,
  getCheckoutStatus,
};

export default purchaseService;
