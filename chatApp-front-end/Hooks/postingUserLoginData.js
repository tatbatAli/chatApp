import axios from "axios";

const postingUserLoginData = async (data) => {
  try {
    const loginResponse = await axios.post(
      "http://localhost:5000/auth/login",
      data
    );
    return loginResponse.data;
  } catch (error) {
    throw error;
  }
};

export default postingUserLoginData;
