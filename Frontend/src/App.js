import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import NavBar from "./components/NavBar/navbar.jsx";
import Home from "./components/Home/home";
import Footer from "./components/Footer/footer";
import MenuPage from "./components/Menu/menu";
import Login from './components/Login/login.jsx';
import SignUp from './components/SignUp/signup.jsx';
import UserProfile from "./components/Profile/user.jsx";
import AddItem from "./components/Items/Form.jsx"
import ShoppingCart from './components/Cart/ShoppingCart.jsx';
import ErrorPage from './components/Error/error'; 
import AdminDashboard from './components/Admin/AdminPage'; 
import AboutUs from "./components/About-Us/aboutpage"
import Info from './components/Nut_N_Rev/Info';


function App() {
  
  return (
    <CartProvider>
      <Router>
        <div className="main-body">
          <p>Hello</p>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<><Home /></>} />
            <Route exact path="/menu" element={<><MenuPage /></>} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<ShoppingCart />} />


            <Route path="/admin/" element={<><AdminDashboard /></>} />
            <Route path="/admin/add-items" element={<><AddItem /></>} />
            <Route path="/about-us" element={<><AboutUs /></>} />
            <Route path="/Info" element={<><Info /></>} />
            
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
