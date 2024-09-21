import axios from "axios";
const API_URL = "/api/users/";

const register = async (userData: any) => {
  let response;
  await axios
    .post(API_URL, userData)
    .then((res) => {
      response = res.data;
      localStorage.setItem("user", JSON.stringify(res.data));
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response;
};

const emailUser = async (userData: any) => {
  if (userData.type === "reset") {
    let response;
    await axios
      .post(API_URL + "reset", userData)
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        if (err) {
          throw new Error(err);
        }
      });

    return response;
  } else if (userData.type === "register") {
    let response;
    await axios
      .post(API_URL + "email", userData)
      .then((res) => {
        response = res.data;
      })
      .catch((err) => {
        if (err) {
          throw new Error(err);
        }
      });

    return response;
  }
};

const emailData = async (token: any) => {
  let response;
  await axios
    .get(API_URL + "email/" + token.toString())
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

const login = async (userData: any) => {
  let response;
  await axios
    .post(API_URL + "login", userData)
    .then((res) => {
      response = res.data;
      localStorage.setItem("user", JSON.stringify(res.data));
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response;
};

const loginGoogle = async (tokenData: any) => {
  let response;
  await axios
    .post(API_URL + "login/google", tokenData)
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

const reset = async (userData: any) => {
  let response;
  await axios
    .put(API_URL + "reset", userData)
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

const getUser = async () => {
  let response;
  await axios
    .get(API_URL + "me")
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

const update = async (userData: any) => {
  let response;
  await axios
    .put(API_URL + "me", userData)
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

const checkToken = async () => {
  let response;
  await axios
    .get(API_URL + "token")
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      if (err) {
        localStorage.removeItem("user");
        throw new Error(err);
      }
    });

  return response;
};

const logout = async () => {
  let response;

  await axios
    .post(API_URL + "logout")
    .then((res) => {
      response = res.data;
      localStorage.removeItem("user");
    })
    .catch((err) => {
      if (err) {
        throw new Error(err);
      }
    });

  return response;
};

const wakeServer = async () => {
  let response;

  await axios
    .get(API_URL + "wakeserver")
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
