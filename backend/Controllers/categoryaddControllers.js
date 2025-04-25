import Category2 from "../Models/Product/category2Models.js";
import Subcategory from "../Models/Product/subcategoryModels.js";
import Subsubcategory from "../Models/Product/subsubcategoryModels.js";
import Subsescategory from "../Models/Product/subsescategory.js";

// sav all category data in one time
export const saveCategories = async (req, res) => {
  const { categories } = req.body; // Expecting a nested array structure

  try {
    for (const categoryData of categories) {
      let categoryDoc = await Category2.findOne({ name: categoryData.name });
      if (!categoryDoc) {
        categoryDoc = new Category2({ name: categoryData.name });
        await categoryDoc.save();
      }

      for (const subcategoryData of categoryData.subcategoriesID) {
        let subcategoryDoc = await Subcategory.findOne({
          name: subcategoryData.name,
          category: categoryDoc._id,
        });
        if (!subcategoryDoc) {
          subcategoryDoc = new Subcategory({
            name: subcategoryData.name,
            category: categoryDoc._id,
          });
          await subcategoryDoc.save();
          categoryDoc.subcategoriesID.push(subcategoryDoc._id);
        }

        for (const subsubcategoryData of subcategoryData.subsubcategoriesID) {
          let subsubcategoryDoc = await Subsubcategory.findOne({
            name: subsubcategoryData.name,
            subcategory: subcategoryDoc._id,
          });
          if (!subsubcategoryDoc) {
            subsubcategoryDoc = new Subsubcategory({
              name: subsubcategoryData.name,
              subcategory: subcategoryDoc._id,
            });
            await subsubcategoryDoc.save();
            subcategoryDoc.subsubcategoriesID.push(subsubcategoryDoc._id);
          }

          for (const subsescategoryData of subsubcategoryData.subsescategoryID ||
            []) {
            let subsescategoryDoc = await Subsescategory.findOne({
              name: subsescategoryData.name,
              subsubcategory: subsubcategoryDoc._id,
            });
            if (!subsescategoryDoc) {
              subsescategoryDoc = new Subsescategory({
                name: subsescategoryData.name,
                subsubcategory: subsubcategoryDoc._id,
              });
              await subsescategoryDoc.save();
              subsubcategoryDoc.subsescategoryID.push(subsescategoryDoc._id);
            }
          }

          await subsubcategoryDoc.save();
        }

        await subcategoryDoc.save();
      }

      await categoryDoc.save();
    }

    res.status(201).json({ message: "Categories saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving categories", error });
  }
};

// Get all Category data with populate
export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category2.find()
      .populate({
        path: "subcategoriesID",
        populate: {
          path: "subsubcategoriesID",
          populate: {
            path: "subsescategoryID",
          },
        },
      })
      .exec();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

// Get all Category data with populate, excluding 'AgriServices'
export const getAllCategoryfirst = async (req, res) => {
  try {
    const categories = await Category2.find({ name: { $ne: "AgriServices" } })
      .populate({
        path: "subcategoriesID",
        populate: {
          path: "subsubcategoriesID",
          populate: {
            path: "subsescategoryID",
          },
        },
      })
      .exec();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

// Get only AgriServices data
export const getAgriServicesCategory = async (req, res) => {
  try {
    const agriServicesCategory = await Category2.findOne({
      name: "AgriServices",
    })
      .populate({
        path: "subcategoriesID",
        populate: {
          path: "subsubcategoriesID",
          populate: {
            path: "subsescategoryID",
          },
        },
      })
      .exec();

    if (!agriServicesCategory) {
      return res
        .status(404)
        .json({ message: "AgriServices category not found" });
    }

    res.status(200).json(agriServicesCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving AgriServices category", error });
  }
};
