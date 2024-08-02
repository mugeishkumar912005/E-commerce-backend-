const mongoose=require('mongoose')
const Cartmodel=new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Product:[
        {
            prd_ID:String,
            Qnt:Number,
            price:Number,

        }
    ]
})
const cart = mongoose.model("cart", Cartmodel);
module.exports=cart