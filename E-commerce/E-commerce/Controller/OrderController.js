const mongoose = require("mongoose");
const Cartmodel = require('../Model/cartmodel');
const OrderModel = require("../Model/orderModel");
const { Disprd } = require("../Controller/cartController");
const {v4:uuidv4} = require("uuid");
const Orderproduct = async (req, res) => {
    const { cust_name, cust_phone, cust_address } = req.body;
    const Email = req.user;
  
    if (!Email) {
      return res.status(400).json({ message: "User email is required" });
    }
  
    try {
      const cart = await Cartmodel.findOne({ Email });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const { productsData, totalAmount } = await Disprd(req, res);
      if (!productsData || totalAmount === undefined) {
        return res.status(500).json({ message: "Error retrieving product details" });
      }
  
      const order = new OrderModel({
        Order_ID:uuidv4(),
        cust_name,
        cust_phone,
        Products:productsData.map(product=>({
            prd_ID:product.prd_ID,
            Qnt:product.Qnt,
            price:product.price
        })),
        cust_address,
        Orderdate: new Date(),
        EstdatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        total_amount: totalAmount,
        Order_status: 'Pending',
        Email
      });
      await order.save();
      await Cartmodel.deleteOne({ Email });

      if (!res.headersSent) {
        res.status(201).json({ message: 'Order created successfully', order });
      }
    } catch (err) {
      console.error("Error in Orderproduct:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: `Server error: ${err.message}` });
      }
    }
  };
  const GetOrder=async(req,res)=>{
    try{
        const Email = req.user;
        if (!Email) {
          return res.status(400).json({ message: "User email is required" });
        }
        const Orders=await OrderModel.find({Email})
        res.status(200).json({
            Orders:Orders
        })
    }catch(err){
        res.status(500).json({
            Msg:"server error",
            Error:err
        })
    }
  }
module.exports = { Orderproduct,GetOrder};
