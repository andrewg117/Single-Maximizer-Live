import axios from "axios";

const API_URL = "/api/purchase/";

const makePurchase = async () => {
  let response;
  await axios
    .post(API_URL)
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

const makeEmbeddedPurchase = async () => {
  let response;
  await axios
    .post(API_URL + "checkout")
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

const getCheckoutStatus = async (session_id: string) => {
  let response;

  await axios
    .get(API_URL + "checkout" + session_id)
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

const purchaseService = {
  makePurchase,
  makeEmbeddedPurchase,
  getCheckoutStatus,
};

export default purchaseService;
