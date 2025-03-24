import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/Users.js";

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const maxAge = 30 * 24 * 60 * 60 * 1000;
const cookie = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: maxAge,
};
const clearCookie = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

router.post("/signIn", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Missing Required Fields" });
  }
  const userExist = await User.findOne({ username });
  if (userExist) {
    return res.status(400).json({ msg: "username already exists" });
  }

  try {
    const difficulty = 10;
    const hashedPassword = await bcrypt.hash(password, difficulty);

    const userData = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, User_Data: userData });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, data: "Error occurred during sign in" });
  }
});

router.post("/login", async (req, res, next) => {
  const { authToken } = req.cookies;
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  const foundUser = await User.findOne({ username: username });
  if (!foundUser) {
    return res.sendStatus(401);
  }

  const matchPwd = await bcrypt.compare(password, foundUser.password);
  if (matchPwd) {
    const accessToken = accessTokenGeneratore({ username: foundUser.username });
    const newRefreshToken = refreshTokenGeneratore({
      username: foundUser.username,
    });
    let newRefreshTokenArray;

    if (!authToken) {
      newRefreshTokenArray = foundUser.refreshToken;
    } else {
      newRefreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== authToken
      );
    }

    const result = await User.updateOne(
      { username: foundUser.username },
      { $set: { refreshToken: [...newRefreshTokenArray, newRefreshToken] } }
    );

    res.cookie("authToken", newRefreshToken, cookie);

    res.status(200).json({ success: true, accessToken: accessToken });
  } else {
    res.status(401).json({ success: false });
  }
});

router.post("/refreshToken", async (req, res) => {
  const { authToken } = req.cookies;
  if (!authToken) {
    return res.status(401).json({ msg: "the authToken is null or undefined" });
  }
  const refreshToken = authToken;

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    return res
      .status(403)
      .json({ msg: "user with this refrehs token doesn't exist" });
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err || foundUser.username !== user.username) {
      console.log("the refresh token is invalid or it expires");

      const result = await User.updateOne(
        { username: foundUser.username },
        { $set: { refreshToken: [...newRefreshTokenArray] } }
      );

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      return res
        .status(403)
        .json({ msg: "the refresh token is invalid or it expires" });
    }

    const accessToken = accessTokenGeneratore({
      username: foundUser.username,
    });
    const newRefreshToken = refreshTokenGeneratore({
      username: foundUser.username,
    });

    const result = await User.updateOne(
      { username: foundUser.username },
      { $set: { refreshToken: [...newRefreshTokenArray, newRefreshToken] } }
    );

    res.cookie("authToken", newRefreshToken, cookie);

    res.status(200).json({ success: true, accessToken: accessToken });
  });
});

router.post("/logout", async (req, res) => {
  const { authToken } = req.cookies;
  if (!authToken) {
    return res.sendStatus(204);
  }
  const refreshToken = authToken;

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("authToken", clearCookie);

    return res.sendStatus(204);
  }

  const result = await User.updateOne(
    { username: foundUser.username },
    { $pull: { refreshToken: [refreshToken] } }
  );

  res.clearCookie("authToken", clearCookie);

  console.log("logout", result);
  res.status(204).json({ msg: `${foundUser.username} Logged Out` });
});

function accessTokenGeneratore(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
}

function refreshTokenGeneratore(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}

export default router;
