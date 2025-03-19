import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/Users.js";
import Token from "../modules/Tokens.js";

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

router.post("/signIn", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Missing Required Fields" });
  }

  try {
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ msg: "username already exists" });
    }

    const difficulty = 10;
    const hashedPassword = await bcrypt.hash(password, difficulty);

    const userData = await User.create({
      username,
      password: hashedPassword,
    });

    const payload = { username };

    const accessToken = accessTokenGeneratore(payload);

    const refreshToken = refreshTokenGeneratore(payload);

    const userToken = await Token.create({
      user: userData._id,
      accessToken,
      refreshToken,
    });

    res.cookie("authToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res
      .status(201)
      .json({ success: true, User_Data: userData, User_Token: userToken });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, data: "Error occurred during sign in" });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ username: username });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(user.username, isPasswordMatch);
    if (!user || !isPasswordMatch) {
      return res.status(400).json({ msg: "Invalid Username/Password" });
    }

    res.status(200).json({ msg: `Welcom ${user.username}` });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.get("/token", async (req, res, next) => {
  try {
    const token = await Token.findOne({}).sort({ _id: -1 });
    res.status(200).json({ success: true, token: token });
  } catch (error) {
    res.status(401).json({ success: false, err: error });
  }
});

router.post("/refreshToken", async (req, res) => {
  const { authToken } = req.cookies;

  const storedToken = await Token.findOne({ refreshToken: authToken });
  if (!storedToken) {
    return res.sendStatus(401);
  }
  jwt.verify(authToken, REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ err });

    const newAccessToken = accessTokenGeneratore({ username: user.username });

    await Token.updateOne(
      { user: storedToken.user },
      { refreshToken: newAccessToken }
    );

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", async (req, res) => {
  const { authToken } = req.cookies;

  await Token.deleteOne({ refreshToken: authToken });

  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ msg: "logged out" });
});

function accessTokenGeneratore(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "40s" });
}

function refreshTokenGeneratore(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "2min",
  });
}

export default router;
