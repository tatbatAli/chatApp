import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/Users.js";
import SendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });

    const url = `${process.env.BASE_URL}/auth/${newUser._id}/verify/${newUser.verificationToken}`;

    await SendEmail(
      newUser.email,
      "Verify Email",
      `Click on this link to verify your email ${url}`
    );

    res.status(201).json({
      success: true,
      User_Data: newUser,
      message: "Email Sent To Your Account. Please Verify it",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: "Error occurred during sign in",
      error: error,
    });
  }
});

router.get("/:id/verify/:token", async (req, res, next) => {
  const id = req.params.id;
  const token = req.params.token;
  const user = await User.findOne({ _id: id, verificationToken: token });
  try {
    if (!user) {
      return res.status(400).json({ msg: "Invalid Link" });
    }

    if (user.verified) {
      return res.status(200).json({ msg: "Your email is already verified" });
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { verified: true }, $unset: { verificationToken: "" } }
    );

    res.status(200).json({ success: true, msg: "Email Sent Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "err in the verify route", error });
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
    let token = foundUser.verificationToken;
    if (!token) {
      token = await User.updateOne(
        { _id: foundUser._id },
        { $set: { verificationToken: verificationToken } }
      );
    }
    const url = `${process.env.BASE_URL}/auth/${foundUser._id}/verify/${foundUser.verificationToken}`;

    await SendEmail(
      foundUser.email,
      "Verify Email",
      `Click on this link to verify your email ${url}`
    );
    return res
      .status(200)
      .json({ message: "Email Sent To Your Account. Please Verify it" });
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

  console.log(newRefreshToken, newRefreshTokenArray);

  const result = await User.updateOne(
    { username: foundUser.username },
    { $set: { refreshToken: [...newRefreshTokenArray, newRefreshToken] } }
  );

  console.log(
    "this is result of the login",
    await User.findOne({ refreshToken: newRefreshToken })
  );

  res.cookie("authToken", newRefreshToken, cookie);

  res.status(200).json({
    success: true,
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

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      return res
        .status(403)
        .json({ msg: "the refresh token is invalid or it expires" });
    }

    const payload = { username: foundUser.username, email: foundUser.email };

    const accessToken = accessTokenGeneratore(payload);
    const newRefreshToken = refreshTokenGeneratore(payload);

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
