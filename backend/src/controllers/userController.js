import prisma from "../config/db.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — No token provided",
    });
  }

  try {
    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    // ✅ Handle deleted/nonexistent users
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GetUser Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const returnX = (req, res) => {
  res.status(200).json({ message: "X returned successfully" });
}
