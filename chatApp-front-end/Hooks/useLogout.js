import api from "../src/api/api";

const useLogout = async () => {
  try {
    const response = await api.post(
      "auth/logout",
      {},
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default useLogout;
