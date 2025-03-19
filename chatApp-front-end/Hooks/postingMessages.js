import axios from "axios";

const postingMessages = async (messages) => {
  try {
    const messageResponse = await axios.post(
      "http://localhost:5000/messages",
      messages
    );
    return messageResponse.data;
  } catch (error) {
    throw error;
  }
};

export default postingMessages;
