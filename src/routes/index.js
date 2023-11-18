import userRouter from "./user.js";
import productRouter from "./product.js";

export const route = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
};
