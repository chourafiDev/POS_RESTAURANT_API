import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import History from "../models/historyModel.js";
import mongoose from "mongoose";

// @desc Create new product
// @route POST api/products
// @access Privet
const createProduct = asyncHandler(async (req, res, next) => {
  let { title, description, price, options, image, category } = req.body;

  const categoryId = new mongoose.Types.ObjectId(category);

  // Upload image to cloudinary
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "pos_app/products",
    });

    image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Create new product
  const newProduct = await Product.create({
    title,
    description,
    price,
    options,
    image,
    category: categoryId,
  });

  if (newProduct) {
    res.status(201).json({
      message: "Product created successfuly",
    });
  } else {
    return next(new ErrorHandler(`Invalide product data`, 400));
  }
});

// @desc Get all products
// @route GET api/products
// @access Privet
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res.status(200).json(products);
});

// @desc Get product by id
// @route GET api/products/:id
// @access Privet
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  res.status(200).json(product);
});

// @desc Update product
// @route PUT api/products/:id
// @access Privet
const updateProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  let { title, description, price, options, image, category } = req.body;
  const categoryId = new mongoose.Types.ObjectId(category);

  const product = await Product.findById(productId);
  if (product) {
    user.title = title || product.title;
    user.price = price || product.price;
    user.description = description || product.description;
    user.category = categoryId || product.category;
    user.options = options || product.options;

    //Update product image
    if (image !== null) {
      const image_id = user.image.public_id;

      if (image_id) {
        //Delete previous image
        await cloudinary.uploader.destroy(image_id);
      }

      //add new image
      const result = await cloudinary.uploader.upload(image, {
        folder: "pos_app/products",
      });

      product.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await product.save();

    res.status(200).json({ message: "Product Updated Successfuly" });
  } else {
    return next(new ErrorHandler(`Product not found`, 404));
  }
});

// @desc Delete product
// @route DELETE api/product/:id
// @access Privet
const deleteProduct = asyncHandler(async (req, res, next) => {
  // Check product if exists
  const productId = req.params.id;
  const product = await Product.findOne({ _id: { $eq: productId } });

  if (!product) {
    return next(new ErrorHandler("Product not found with this id", 404));
  }

  //Remove product photo
  const imageId = product.image.public_id;
  if (imageId) {
    await cloudinary.uploader.destroy(imageId);
  }

  // Delete product
  await Product.findByIdAndRemove(productId);

  //History for delete product
  await History.create({
    action: "Deletion",
    description: `Delete product (${product.title})`,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    messageSuccess: "Product deleted successfuly",
  });
});

export {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  updateProduct,
};
