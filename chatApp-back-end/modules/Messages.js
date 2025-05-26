import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: String,
      required: true,
    },
    recepientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recepient: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timeOfMessage: {
      type: String,
      required: true,
    },
    dayOfMessage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Message", MessageSchema);

export default Messages;
