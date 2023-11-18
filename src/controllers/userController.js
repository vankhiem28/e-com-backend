import Joi from "joi";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../services/jwtServices.js";

class UserController {
  // POST /user/register
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword, isAdmin, phone } = req.body;

      // validate data
      const joiSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required()
          .messages({ "string.email": `Email is invalid`, "any.required": "Email is required" }),
        password: Joi.string()
          .min(5)
          .max(30)
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
        confirmPassword: Joi.string().equal(password).required(),
        phone: Joi.string().required(),
      });

      await joiSchema.validateAsync({
        name,
        email,
        password,
        phone,
        confirmPassword,
      });

      // check email existing
      const isExistingEmail = await userModel.findOne({ email });
      if (isExistingEmail) throw new Error("Email already exists");

      // hash password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      const data = {
        ...req.body,
        password: hashPassword,
      };

      // create a new user
      const document = await userModel.create(data);

      res.status(200).json({
        susscess: true,
        data: document,
      });
    } catch (error) {
      res.status(500).json({
        susscess: false,
        message: error.message,
      });
    }
  }
  // POST /user/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // check email
      const user = await userModel.findOne({ email: email });
      if (!user) {
        throw new Error("User not found");
      }
      // check password
      const isCompare = await bcrypt.compare(password, user.password);
      if (!isCompare) {
        throw new Error("Password not match");
      }
      // create access_token
      const access_token = await generateToken({
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      });
      // create refresh_token
      const refresh_token = await generateRefreshToken({
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      return res.status(200).json({
        susscess: true,
        access_token,
        refresh_token,
      });
    } catch (error) {
      return res.status(500).json({
        susscess: false,
        message: error.message,
      });
    }
  }
  // POST /user/update/:id
  async update(req, res) {
    try {
      const userId = req.params.id;
      const { name, email, password, confirmPassword, isAdmin, phone } = req.body;

      // validate data
      const joiSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required()
          .messages({ "string.email": `Email is invalid`, "any.required": "Email is required" }),
        password: Joi.string()
          .min(5)
          .max(30)
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required(),
        isAdmin: Joi.boolean().default(false).required(),
        confirmPassword: Joi.string().equal(password).required(),
        phone: Joi.string().required(),
      });
      await joiSchema.validateAsync({
        name,
        email,
        password,
        isAdmin,
        phone,
        confirmPassword,
      });

      // hash password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      const data = {
        name,
        email,
        password: hashPassword,
        isAdmin,
        phone,
      };

      const document = await userModel.findByIdAndUpdate({ _id: userId }, data, { new: true });
      return res.status(200).json({
        susscess: true,
        data: document,
      });
    } catch (error) {
      return res.status(500).json({
        susscess: false,
        message: error.message,
      });
    }
  }
  // POST /user/delete/:id
  async delete(req, res) {
    try {
      const userId = req.params.id;
      const ObjectId = mongoose.Types.ObjectId;
      const document = await userModel.findByIdAndDelete({ _id: new ObjectId(userId) });
      if (!document) throw new Error("Not found");
      return res.status(200).json({
        susscess: true,
        message: "Delete successfully",
      });
    } catch (error) {
      return res.status(500).json({
        susscess: false,
        message: error.message,
      });
    }
  }
  // POST /user/
  async getUsers(req, res) {
    try {
      const documents = await userModel.find();
      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return res.status(200).json({
        success: true,
        message: error.message,
      });
    }
  }
  // POST /user/:id
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const document = await userModel.findById({ _id: userId });
      if (!document) throw new Error("Not found");
      return res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      return res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
  // POST /user/refresh-token
  async refreshToken(req, res) {
    try {
      // get refresh token
      const refreshtoken = req?.headers?.authorization?.split(" ")[1];
      if (!token) throw new Error("Invalid token");

      // verify token
      const jwtObject = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN);

      const access_token = await generateToken({
        id: jwtObject.id,
        email: jwtObject.email,
        isAdmin: jwtObject.isAdmin,
      });

      return res.status(200).json({
        success: true,
        data: access_token,
      });
    } catch (error) {
      return res.status(200).json({
        success: true,
        message: error.message,
      });
    }
  }
}
export default new UserController();
