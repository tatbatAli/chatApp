import express from "express";
import Messages from "../modules/Messages.js";
import User from "../modules/Users.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    senderId,
    sender,
    recepientId,
    recepient,
    message,
    timeOfMessage,
    dayOfMessage,
  } = req.body;
  if (
    !senderId ||
    !sender ||
    !recepientId ||
    !recepient ||
    !message ||
    !timeOfMessage ||
    !dayOfMessage
  ) {
    return res.status(400).json({ msg: "Missing Required Field" });
  }
  try {
    const conversation = await Messages.create({
      senderId,
      sender,
      recepientId,
      recepient,
      message,
      timeOfMessage,
      dayOfMessage,
    });
    res.status(200).json({ message: conversation });
  } catch (error) {
    res.status(400).json({ msg: "Page Not found" });
  }
});

router.get("/:sender/:recepient", async (req, res) => {
  const { recepient, sender } = req.params;

  try {
    const currentUser = await User.findById(sender);
    const recepientUser = await User.findById(recepient);

    if (!currentUser || !recepientUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const message = await Messages.find({
      $or: [
        { senderId: currentUser, recepientId: recepient },
        { senderId: recepient, recepientId: currentUser },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      recepientUsername: recepientUser.username,
      recepientId: recepientUser._id,
      message: message,
    });
  } catch (error) {
    res.status(400).json({ "finding a message": error });
  }
});

router.get("/checkMessages", async (req, res) => {
  try {
    const messagesCount = await Messages.countDocuments();
    res.status(200).json({ hasMessages: messagesCount > 0 });
  } catch (error) {
    res.status(404).json({ err: error });
  }
});

export default router;
