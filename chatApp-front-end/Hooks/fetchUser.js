import axios from "axios";

const fetchUser = async () => {
  try {
    const userResponse = await axios.get("http://localhost:5000/users");
    return userResponse.data;
  } catch (error) {
    console.log("err fetching users", error);
  }
};

export default fetchUser;
