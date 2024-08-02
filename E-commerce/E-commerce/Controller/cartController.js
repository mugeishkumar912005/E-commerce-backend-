const mongoose = require('mongoose');
const Cartmodel = require('../Model/cartmodel');
const AddtoCart = async (req, res) => {
    const { prd_ID, Qnt,price} = req.body;
    try {
      console.log("Request Body:", req.body);
      console.log("req.user:", req.user);
  
      let Exuser = await Cartmodel.findOne({ Email: req.user });
      console.log("Existing Cart:", Exuser);
  
      if (!Exuser) {
        Exuser = new Cartmodel({
          Email: req.user,
          Product: [{ "prd_ID":prd_ID,"Qnt":Qnt,"price":price}]
        });
        console.log("New Cart Created:", Exuser);
      } else {
        const existingProduct = Exuser.Product.find(p => p.prd_ID === prd_ID);
        // if(existingProduct.Qnt<1){
        //   DelPrd()
        // }
        console.log("Existing Product:", existingProduct);
        if (existingProduct) {
          existingProduct.Qnt += 1;
          console.log("Updated Quantity:", existingProduct.Qnt);
        } else {
          Exuser.Product.push({ "prd_ID":prd_ID, "Qnt":Qnt,"price":price});
          console.log("Product Added:", { prd_ID, Qnt});
        }
      } 
      const savedCart = await Exuser.save();
      console.log("Saved Cart:", savedCart);
  
      res.status(200).json({
        Msg: "Successfully added or updated!",
        savedCart
      });
    } catch (error) {
      console.error("Error while adding product to cart:", error);
      res.status(500).json({
        Msg: "Server Error"
      });
    }
  };

  const Disprd = async (req) => {
    try {
      const email = req.user;
      if (!email) {
        throw new Error("User email is missing");
      }
  
      const cart = await Cartmodel.findOne({ Email: email });
      if (!cart) {
        throw new Error("User does not exist or cart is empty");
      }
  
      const productsData = cart.Product.map(product => ({
        prd_ID: product.prd_ID,
        quantity: product.Qnt,
        price: product.price,
        total: product.price * product.Qnt
      }));
  
      const totalAmount = productsData.reduce((sum, item) => sum + item.total, 0);
  
      return {
        productsData,
        totalAmount
      };
  
    } catch (err) {
      throw err;
    }
  };
  
  
  const DelPrd = async (req, res) => {
    const { prd_ID } = req.body;
    const userEmail = req.user;
    try {
      const userCart = await Cartmodel.findOne({ Email: userEmail });
      if (!userCart) {
        return res.status(404).json({
          Msg: `Cart for user with email ${userEmail} not found`
        });
      }
      const pID= userCart.Product.findIndex(p => p.prd_ID === prd_ID);
      if (pID === -1) {
        return res.status(404).json({
          Msg: `Product with ID ${prd_ID} not found in the cart`
        });
      }
      if (userCart.Product[pID].Qnt > 1) {
        userCart.Product[pID].Qnt -= 1;
      } else {
        userCart.Product.splice(pID, 1);
      }
      if(userCart.Product.length==0){
        const DelC=await Cartmodel.deleteOne({Email:userEmail})
        if(!DelC){
            res.status(404).json({
            Msg: `something went wrong`
          });
        }
        res.status(200).json({
          Msg:"Successfully Droped cart"
        })
      }
      await userCart.save();
      return res.status(200).json({
        Msg: `Successfully deleted product with ID ${prd_ID}`
      });
    } catch (err) {
      console.error('Server Error:', err); 
      res.status(500).json({
          Msg: "Server Error",
          Error: err.message 
        });
      }
    }
  module.exports = {AddtoCart,Disprd,DelPrd};
  
  
