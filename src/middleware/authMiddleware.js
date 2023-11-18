import jwt from "jsonwebtoken";

export const adminMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) throw new Error("Token not provided");
    const jwtObject = jwt.verify(token, process.env.ACCESS_TOKEN);
    if (jwtObject.isAdmin) {
      next();
    } else {
      throw new Error("User don't have permission to implement the this method");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userMiddleware = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) throw new Error("Token not provided");
    const jwtObject = jwt.verify(token, process.env.ACCESS_TOKEN);
    if (jwtObject.isAdmin || jwtObject.id === userId) {
      next();
    } else {
      throw new Error("User don't have permission to implement the this method");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
