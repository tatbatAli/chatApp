import User from "../modules/Users.js";
import upload from "../middleware/upload.js";
import express from "express";

const router = express.Router();

router.post("/uploadAvatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.userId;
    const imageUrl = `uploads/${req.file.filename}`;

    const addImageTotheUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );

    res.status(200).json({
      msg: "profile iamge updated succefully",
      image: addImageTotheUser.image,
    });
  } catch (error) {
    res.status(500).json({ msg: "server err", error });
  }
});

router.get("/getAvatar", async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    res.status(200).json({ image: user.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
