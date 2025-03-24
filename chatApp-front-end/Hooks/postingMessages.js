import api from "../src/api/api";
const postingMessages = async (messages) => {
  try {
    const messageResponse = await api.post("messages", messages);
    return messageResponse.data;
  } catch (error) {
    throw error;
  }
};

export default postingMessages;
