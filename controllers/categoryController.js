import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import History from "../models/historyModel.js";

// @desc Create New Category
// @route POST api/categories
// @access Privet
const createCategory = asyncHandler(async (req, res, next) => {
  let { name, icon, description } = req.body;

  // Check if Category already exists
  const CategoryExist = await Category.findOne({ name });

  if (CategoryExist) {
    return next(
      new ErrorHandler(`Category with this name (${name}) already exists`, 404)
    );
  }

  // Upload icon to cloudinary
  if (icon) {
    const result = await cloudinary.uploader.upload(icon, {
      folder: "pos_app/categories",
    });

    icon = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Create new Category
  const newCategory = await Category.create({
    name,
    icon,
    description,
  });

  if (newCategory) {
    res.status(201).json({
      message: "Category created successfuly",
    });
  } else {
    return next(new ErrorHandler(`Invalide Category data`, 400));
  }
});

// @desc Get all categories
// @route GET api/categories
// @access Privet
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
});

// @desc Get categorie by id
// @route GET api/categories/:id
// @access Privet
const getCategorieById = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);

  res.status(200).json(category);
});

// @desc Update categorie
// @route PUT api/categories/:id
// @access Privet
const updateCategorie = asyncHandler(async (req, res, next) => {
  const categorieId = req.params.id;
  const { name, icon, description } = req.body;

  const categorie = await Category.findById(categorieId);

  if (categorie) {
    categorie.name = name || categorie.name;
    categorie.description = description || categorie.description;

    //Update categorie icon
    if (icon) {
      const icon_id = categorie.icon.public_id;

      if (icon_id) {
        //Delete previous icon
        await cloudinary.uploader.destroy(icon_id);
      }

      //add new icon
      const result = await cloudinary.uploader.upload(icon, {
        folder: "pos_app/categories",
      });

      categorie.icon = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await categorie.save();

    res.status(200).json({ message: "Categorie updated Successfuly" });
  } else {
    return next(new ErrorHandler(`Categorie not found`, 404));
  }
});

// @desc Delete categorie
// @route DELETE api/categories/:id
// @access Privet
const deleteCategorie = asyncHandler(async (req, res, next) => {
  // Check categorie if exists
  const categorieId = req.params.id;
  const categorie = await Category.findOne({ _id: { $eq: categorieId } });

  if (!categorie) {
    return next(new ErrorHandler("Categorie not found with this id", 404));
  }

  //Remove categorie icon
  const iconId = categorie.icon.public_id;
  if (iconId) {
    await cloudinary.uploader.destroy(iconId);
  }

  // Delete categorie
  await Category.findByIdAndRemove(categorieId);

  //History delete categorie
  await History.create({
    action: "Deletion",
    description: `Delete categorie (${categorie.name})`,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    messageSuccess: "Categorie deleted successfuly",
  });
});

export {
  createCategory,
  getAllCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie,
};
