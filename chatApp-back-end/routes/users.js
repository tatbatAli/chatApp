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

export default router;
