import jwt from "jsonwebtoken";

const generateToken = (res: any, userId: any, expire: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: expire,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    // maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // maxAge: 2 * 60 * 60 * 1000, // 2 hours
    maxAge: 1 * 10 * 60 * 1000, // 30 min
    // maxAge: 10 * 60 * 1000, // 10 seconds
  });
};

export {
  generateToken,
};
