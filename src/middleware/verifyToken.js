import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No JWT token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer '
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);

    res.status(403).json({ message: "Unauthorized: Invalid JWT token" });
  }
};
 