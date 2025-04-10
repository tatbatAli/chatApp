import { useSelector } from "react-redux";
import api from "../src/api/api";
const useFetchUser = () => {
  const accessT = useSelector((state) => state.userSlice.token);
  const id = useSelector((state) => state.userSlice.userId);

  const getUser = async () => {
    if (!accessT) {
      console.log("No access token available");
      return null;
    }

    try {
      const userResponse = await api.get(`users/${id}`);
      return userResponse.data;
    } catch (error) {
      console.log("Error fetching users", error);
      return null;
    }
  };

  return getUser;
};

export default useFetchUser;
