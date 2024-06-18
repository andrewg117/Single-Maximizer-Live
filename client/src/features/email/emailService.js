import axios from "axios";

const API_URL = "/api/email/";

const sendEmail = async (emailData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, emailData, config);

  return response.data;
};

const emailService = {
  sendEmail,
};

export default emailService;
