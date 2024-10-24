import jwt from "jsonwebtoken";

export default function isLoggedIn(req, res, next) {
  if (
    !req.cookies ||
    !req.cookies.token ||
    req.header("Authorization")?.replace("Bearer ", "")
  ) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Missing Access token!!" });
  }
  try {
    const decoded = jwt.verify(
      req.cookies.token,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    // Handle invalid or expired token gracefully
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
}
