import axios from "axios";
const API_URL = "/api/users/";

const register = async (userData: any) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const emailUser = async (userData: any) => {
  if (userData.type === "reset") {
    const response = await axios.post(API_URL + "reset", userData);

    return response.data;
  } else if (userData.type === "register") {
    const response = await axios.post(API_URL + "email", userData);

    return response.data;
  }
};

const emailData = async (token: any) => {
  const response = await axios.get(API_URL + "email/" + token.toString());
  // console.log(token)
  return response.data;
};

const login = async (userData: any) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const loginGoogle = async (tokenData: any) => {
  const response = await axios.post(API_URL + "login/google", tokenData);

  return response.data;
};

const reset = async (userData: any) => {
  const response = await axios.put(API_URL + "reset", userData);

  return response.data;
};

const getUser = async () => {
  let response;

  response = await axios.get(API_URL + "me");
  console.log(document.cookie);

  return response.data;
};

const update = async (userData: any) => {
  let response;

  response = await axios.put(API_URL + "me", userData);

  return response.data;
};

const checkToken = async () => {
  let response;

  response = await axios.get(API_URL + "token");
  // console.log(response.status)
  if (response.status === 401) {
    localStorage.removeItem("user");
  }

  return response.data;
};

const logout = async () => {
  const response = await axios.post(API_URL + "logout");

  if (response.data) {
    localStorage.removeItem("user");
  }

  return response.data;
};

const wakeServer = async () => {
  let response;

  response = await axios.get(API_URL + "wakeserver");

  return response.data;
};

const authService = {
  register,
  emailUser,
  emailData,
  login,
  loginGoogle,
  reset,
  getUser,
  update,
  checkToken,
  logout,
  wakeServer,
};

export default authService;
