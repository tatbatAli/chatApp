import api from "../src/api/api";
const postingUserSignUpData = async (data) => {
  try {
    const userDataResponse = await api.post("auth/signIn", data, {
      withCredentials: true,
    });
    return userDataResponse.data;
  } catch (error) {
    throw error;
  }
};

export default postingUserSignUpData;
