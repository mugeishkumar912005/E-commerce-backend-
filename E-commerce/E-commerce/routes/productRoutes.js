const express = require("express");
const router = express.Router();
const productController = require("../Controller/productController");
const cartController=require("../Controller/cartController.js")
const OrderController=require("../Controller/OrderController.js")
const Auth=require("../middleware/auth.js");
router.get("/products",Auth,productController.getAllproducts);
router.post("/addproduct", productController.addproducts);
router.put("/updateproduct/:id", productController.updateproducts);
router.delete("/deleteproduct/:id",productController.deleteproducts);
router.post("/createUser",productController.createUser);
router.post("/verUser",productController.VerUSer);
router.post("/AddtoCart",Auth,cartController.AddtoCart);
router.get('/dispprd',Auth,cartController.Disprd);
router.delete('/Delprd',Auth,cartController.DelPrd);
router.post('/Orderproduct',Auth,OrderController.Orderproduct);
router.get('/getord',Auth,OrderController.GetOrder);
// router.delete('DelCart',Auth,cartController.Delcart);
module.exports = router;