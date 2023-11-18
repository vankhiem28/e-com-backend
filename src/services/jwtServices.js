import jwt from "jsonwebtoken";

const generateToken = async (data) => {
  const access_token = jwt.sign(
    {
      ...data,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
  return access_token;
};

const generateRefreshToken = async (data) => {
  const refresh_token = jwt.sign(
    {
      ...data,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refresh_token;
};

export { generateToken, generateRefreshToken };
