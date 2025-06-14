import api from "../src/api/api";
const postingUserLoginData = async (data) => {
  try {
    const loginResponse = await api.post("auth/login", data);

    return loginResponse.data;
  } catch (error) {
    throw error;
  }
};

export default postingUserLoginData;
