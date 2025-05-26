import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/Users.js";
import SendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import verificationEmail from "../utils/verificationEmail.js";
import forgetPwd from "../utils/forgetPwd.js";
import path from "path";

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const maxAge = 7 * 24 * 60 * 60 * 1000;
const cookie = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: maxAge,
  path: "/",
};
const clearCookie = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
};
let verificationToken = crypto.randomBytes(32).toString("hex");

router.post("/signIn", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ msg: "Missing Required Fields" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ msg: "username already exists" });
  }

  try {
    const difficulty = 10;
    const hashedPassword = await bcrypt.hash(password, difficulty);
    const emailToken = jwt.sign({ email }, verificationToken, {
      expiresIn: "1h",
    });

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken: emailToken,
    });

    await verificationEmail(newUser);

    res.status(201).json({
      success: true,
      User_Data: newUser,
      message: "Email Sent To Your Account. Please Verify it",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error occurred during sign in",
      error: error,
    });
  }
});

router.get("/:id/verify/:token", async (req, res, next) => {
  const id = req.params.id;
  const token = req.params.token;
  const user = await User.findById(id);
  try {
    if (!user || user.verificationToken !== token) {
      return res.status(400).json({ success: false, msg: "Invalid Link" });
    }

    jwt.verify(token, verificationToken, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ msg: "The link is expired, Try again." });
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { verified: true }, $unset: { verificationToken: "" } }
      );

      res.status(200).json({ success: true, msg: "Email Sent Successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "err in the verify route", error });
  }
});

router.get("/:id/notMe", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    await User.deleteOne({ _id: id });

    res.status(200).json({ success: true, msg: "Verification Canceled" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error", error });
  }
});

router.post("/login", async (req, res, next) => {
  const { authToken } = req.cookies;
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    return res.status(401).json({ msg: "user not found" });
  }

  const matchPwd = await bcrypt.compare(password, foundUser.password);
  if (!matchPwd) {
    return res.status(401).json({ msg: "Invalid password" });
  }
  if (!foundUser.verified) {
    const emailToken = jwt.sign({ email: foundUser.email }, verificationToken, {
      expiresIn: "1h",
    });

    await User.updateOne(
      { _id: foundUser._id },
      { $set: { verificationToken: emailToken } }
    );

    const user = await User.findById(foundUser._id);

    await verificationEmail(user);

    return res.status(200).json({
      success: false,
      msg: "Email Sent To Your Account. Please Verify it",
    });
  }

  const payload = { username: foundUser.username, email: foundUser.email };

  const accessToken = accessTokenGeneratore(payload);
  const newRefreshToken = refreshTokenGeneratore(payload);

  let newRefreshTokenArray = [];

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

  res.status(200).json({
    success: true,
    userId: foundUser._id,
    msg: "login successfully",
    accessToken: accessToken,
  });
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
      .json({ msg: "user with this refresh token doesn't exist" });
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  ); // filterd out expired or invalid refresh token from the foundUser.refreshToken array

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err || foundUser.username !== user.username) {
      console.log("the refresh token is invalid or it expires");

      const result = await User.updateOne(
        { username: foundUser.username },
        { $set: { refreshToken: [...newRefreshTokenArray] } }
      );

      res.clearCookie("authToken", clearCookie);

      return res
        .status(403)
        .json({ msg: "the refresh token is invalid or it expires" });
    }

    const payload = { username: foundUser.username, email: foundUser.email };

    const accessToken = accessTokenGeneratore(payload);

    res.status(200).json({ success: true, accessToken: accessToken });
  });
});

router.post("/forgetPwd", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "email is invalid" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "there's no user with this emaiil" });
    }

    await forgetPwd(user);

    res
      .status(200)
      .json({ success: true, msg: "Password reset sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
});

router.post("/:id/resetPwd", async (req, res, next) => {
  const { password } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: "there's no user with such id" });
  }
  if (!password) {
    return res.status(200).json({ success: false, msg: "password is invalid" });
  }
  try {
    const difficulty = 10;
    const hashedPassword = await bcrypt.hash(password, difficulty);

    const update = await User.updateOne(
      { _id: id },
      { $set: { password: hashedPassword } }
    );

    return res
      .status(200)
      .json({ success: true, msg: "password update successfully" });
  } catch (error) {
    res.status(500).json({ msg: "server err" });
  }
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
    { $pull: { refreshToken: refreshToken } }
  );

  res.clearCookie("authToken", clearCookie);

  console.log("logout", result);
  res.status(204).json({ msg: `Logged Out` });
});

function accessTokenGeneratore(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "30min" });
}

function refreshTokenGeneratore(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export default router;
