const {productSchema} = require("../Model/productModel");
const {usermodel}=require("../Model/usermodel.js")
const Auth=require('../middleware/auth.js')
const mongoose=require('mongoose')
const Product = mongoose.model("products",productSchema);
const users=mongoose.model("usermodel",usermodel)
const{v4:uuidv4}=require('uuid')
const bcrypt=require("bcrypt")
const JWT =require('jsonwebtoken')
//add product
const addproducts = async (req,res)=>{
    try{
        const{id,title,description,category,price,image,rating}=req.body;
        const product= new Product({
            id:uuidv4(),
            title,
            description,
            category,
            price,
            image,
            rating
        })
        await product.save();
        res.send(product);

    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
};

//get product
const getAllproducts = async (req,res) =>{
    console.log(req.user)
    try{
        const products = await Product.find();
        res.send(products);
    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
    
    
};
//update product

const updateproducts = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body; 
        const updatedProduct = await Product.findOneAndUpdate({id}, updateData, { new: true }); // Use the id directly
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
        res.send(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


const deleteproducts = async(req,res)=>{
    try{
        const {id}=req.params;
        const deleteProduct = await Product.findOneAndDelete(id);
        if(!deleteProduct){
            return res.status(404).send("product not found");
        }
        res.send('product deleted successfully');
    }catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
}; 
const createUser=async(req,res)=>{
    const {username,Email,PhoneNo,Password}=req.body;
    try{
        const hashedPassword = await bcrypt.hash(Password, 10);
        const ExEmail=users.find({Email});
        if(!ExEmail){
            res.status(200).json({
                Msg:"new user created",
                New:newuser
               })
            res.status(402).json({
               Msg:"User already Exist"
            })
       }
        const newuser=await users.create({"username":username,"Email":Email,"PhoneNo":PhoneNo,"Password":hashedPassword});
        if(!newuser){
            res.status(404).json({
                Msg:"Oops something went wrong"
            })
        }
        
    }catch(err){
        res.status(500).json({
            Msg:"Server Error",
            error:err
        })
    }
}

const VerUSer = async(req, res) => {
    const { Email, Password } = req.body;
    try {
      const ver = await users.findOne({Email});
      if (ver) {
        const isMatch = await bcrypt.compare(Password, ver.Password);
        if (isMatch) {
            const Token=JWT.sign({Email},"Y+88p4NldTYqVNWLSVKODcprx0g59PackkQWqGwxow0=",{
                expiresIn:"2h",
            })
            if(!Token){
                res.send("you are an unauthorized user!")
            }
            return res.status(200).json({
            Msg: "Login Successful",
            Email,
            Password,
            Token,
          });
        } else {
          return res.status(401).json({
            Msg: "Invalid credentials",
          });
        }
      } else {
        return res.status(401).json({
          Msg: "Invalid credentials",
        });
      }
    } catch (err) {
      return res.status(500).json({
        Msg: "Server error",
        error: err,
      });
    }
  };
  

module.exports = {addproducts,getAllproducts,updateproducts,deleteproducts,createUser,VerUSer};