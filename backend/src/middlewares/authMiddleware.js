import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return res.status(401).json({
      message: "Access Denied - No token Provided",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
