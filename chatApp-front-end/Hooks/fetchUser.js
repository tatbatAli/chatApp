import { useSelector } from "react-redux";
import api from "../src/api/api";
const useFetchUser = () => {
  const accessT = useSelector((state) => state.userSlice.token);
  const id = useSelector((state) => state.userSlice.userId);

  const getUser = async () => {
    if (!accessT || !id) {
      console.log("No access token available or id");
    }

    try {
      const userResponse = await api.get(`users/${id}`);

      console.log("fetch user", userResponse.data);
      return userResponse.data;
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  return getUser;
};

export default useFetchUser;
