import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import client from "../config/googleClient.js";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;

    // ✅ Trim and normalize input
    name = name?.trim();
    username = username?.trim();
    email = email?.trim().toLowerCase();

    // ✅ Check for missing fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check for existing username/email
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // ✅ Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = process.env.ADMIN_EMAIL === email;

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });

    // ✅ Respond success
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ success: false, message: "Email or Username already in use" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginController = async (req, res) => {
  try {
    let { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Both username and password are required",
      });
    }

    // ✅ Normalize username (trim, lowercase if applicable)
    username = username.trim();

    // ✅ Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with that username",
      });
    }

    // ✅ Prevent login if Google user tries with password
    if (user.provider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please log in with Google.",
      });
    }

    // ✅ Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ Create JWT
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "50m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 50 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
      },
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, userId: decoded.id });
  } catch {
    res.json({ success: false });
  }
};

export const refreshTokenController = async (req, res) => {
  
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No Refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "50m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 50 * 60 * 1000,
    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Logged out" });
};


//google oauth sign in
export const googleOAuthSignupController = (req, res) => {
  const authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  });
  res.redirect(authorizationUrl);
};

//google callback handling
export const googleCallbackController = async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    });

    const idToken = tokens.id_token;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          googleId: sub,
          image: picture,
        },
      });
    }

    // Generate JWTs
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    //store access token in cookie
     res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 50 * 60 * 1000,
    });

    // Store refresh token in cookie (secure)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with short-lived access token
    const redirectUrl = `${process.env.CLIENT_URL}/auth/success`;
    return res.redirect(redirectUrl);
  } catch (error) {        
    console.error("Google Callback Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
  }
};
