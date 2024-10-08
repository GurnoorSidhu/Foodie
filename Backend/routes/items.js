const Category = require('../models/category');
const Item = require('../models/item');
const express = require("express");
const NUTRIENTS = require('../models/Nutrients');
const router = express.Router();

router.get('/food-items', async (req, res) => {
    try {
      const categories = await Category.find().populate("food_item");
      res.json(categories);
    } catch (err) {
      console.error('Error fetching food items:', err);
      res.status(500).json({ message: 'Failed to fetch food items' });
    }
  });
  


// Create a new category
router.post('/categories', async (req, res) => {
  try {
    const { category_title, category_description, category_icon } = req.body;
    const newCategory = new Category({
      category_title,
      category_description,
      category_icon,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new item
router.post('/items', async (req, res) => {
  try {
    const { item_title, item_type, item_price, item_offer, item_src,
        calories, fat, protein, carbohydrates, cholestrol
     } = req.body;
    let newItem;
    if(item_offer===""){
        newItem = new Item({
            item_title,
            item_type,
            item_price,
            item_src,
          });
    }
    else{
        newItem = new Item({
            item_title,
            item_type,
            item_price,
            item_offer,
            item_src,
          });
    }
      const nutrient= new NUTRIENTS({
        calories,
        fat,
        protein,
        carbohydrates,
        cholestrol,
      });

      newItem.nutrients=nutrient._id;
  
      await nutrient.save();

      await newItem.save();

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add an item to a category
router.put('/categories/:categoryId/addItem', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { itemId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    category.food_item.push(item._id);
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate({
      path: 'reviews',
      select: 'user comment createdAt', 
      populate: {
        path: 'user',  // If each review references a user, you can populate that too
        select: 'fullName email'  // Populate fields from the User schema
      }
    }).populate("nutrients");
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a item
router.delete('/item/:id', async (req,res)=> {
  try {
    const itemId = req.params.id;
    const items = await Item.findOneAndDelete(itemId);
    res.json("item deleted");
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

router.get('/item/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    if(!item) {
      return res.json({message:"Item not Found."})
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
