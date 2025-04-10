import express from "express";
import User from "../modules/Users.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getUser = await User.find({ _id: { $ne: id } }, "username");
    res.status(200).json(getUser);
  } catch (error) {
    res.status(404).json({ msg: "error fetching user", error });
  }
});

router.get("/userName/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ name: user.username });
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json("server error");
  }
});

export default router;
