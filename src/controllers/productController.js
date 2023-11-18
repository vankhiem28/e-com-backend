import productModel from "../models/productModel.js";

class ProductController {
  // POST /product/create
  async create(req, res) {
    try {
      // check name product
      const document = await productModel.findOne({ name: req.body.name });
      if (document) throw new Error("Product already exists");

      // check price product
      if (req.body.price < 0) throw new Error("Price invalid");

      const data = {
        ...req.body,
      };
      const createProduct = await productModel.create(data);
      res.status(200).json({
        success: true,
        data: createProduct,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
  // PUT /product/update/:id
  async update(req, res) {
    try {
      // check isExistingProduct
      const document = await productModel.findById({ _id: req.params.id });
      if (!document) throw new Error("Not Found");
      // check name of product
      const isValidName = await productModel.findOne({ name: req.body.name });
      if (isValidName) throw new Error("Name is already");
      // check price product
      if (req.body.price < 0) throw new Error("Price invalid");
      // update
      const data = {
        ...req.body,
      };
      const update = await productModel.findByIdAndUpdate({ _id: req.params.id }, data, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        data: update,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // DELETE /product/delete/:id
  async delete(req, res) {
    try {
      const productId = req.params.id;
      if (!productId) throw new Error("Not provided productId");
      await productModel.findByIdAndDelete({ _id: productId });
      return res.status(200).json({ success: true, message: "Delete successfully" });
    } catch (error) {
      return res.status(200).json({ success: false, message: error.message });
    }
  }
  // GET /product
  async getAllProducts(req, res) {
    try {
      const documents = await productModel.find();
      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
  // GET /product/:id
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const document = await productModel.findById({ _id: productId });
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
}

export default new ProductController();
