import userRouter from "./user.js";

export const route = (app) => {
  app.use("/api/user", userRouter);
};
