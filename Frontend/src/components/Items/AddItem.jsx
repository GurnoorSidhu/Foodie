import React, { useState } from 'react';
import './style.css';
// import { set } from 'mongoose';

const AddItemForm = ({ categories, onAddItem }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('veg'); 
  const [price, setPrice] = useState('');
  const [offer, setOffer] = useState('');
  const [image, setImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [protein,setProtein] = useState('NA');
  const [calories,setCalories] = useState('NA');
  const [carbs,setCarbs] = useState('NA');
  const [fat,setFat] = useState('NA');
  const [cholestrol,setCholestrol] = useState('NA');
  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      item_title: title,
      item_type: type,
      item_price: price,
      item_offer: offer,
      item_src: image,
      calories: calories,
      protein: protein,
      carbohydrates: carbs,
      fat: fat,
      cholestrol:cholestrol
    };
    if (selectedCategory) {
      onAddItem(selectedCategory, newItem);
     
      setTitle('');
      setType('veg');
      setPrice('');
      setOffer('');
      setImage('');
      setSelectedCategory('');
      setProtein('NA');
      setCarbs('NA');
      setFat('NA');
      setCholestrol('NA');
    } else {
      console.error('Please select a category.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="veg">Veg</option>
          <option value="nonveg">Non-Veg</option>
        </select>
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Offer:</label>
        <input type="text" value={offer} onChange={(e) => setOffer(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Image:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Select Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
          <option value="">Select a category</option>
          {categories.length>0 && categories.map(category => (
            <option key={category._id} value={category._id}>{category.category_title}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Protein:</label>
        <input type="text" value={protein} onChange={(e) => setProtein(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Calories:</label>
        <input type="text" value={calories} onChange={(e) => setCalories(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Fat:</label>
        <input type="text" value={fat} onChange={(e) => setFat(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Carbohydrates:</label>
        <input type="text" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Cholesterol:</label>
        <input type="text" value={cholestrol} onChange={(e) => setCholestrol(e.target.value)} />
      </div>
      <button type="submit" className="btn-submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
