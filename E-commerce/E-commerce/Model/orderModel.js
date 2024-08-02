const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    Order_ID:{
        type:String
    },
    cust_name: {
        type: String,
        required: true,
    },
    cust_phone: {
        type: Number,
        required: true,
    },
    cust_address: {
        type: String,
        required: true,
    },
    Orderdate: {
        type: Date,
        default: Date.now
    },
    EstdatedDate: {
        type: Date,
    },
    products: [{
        prd_ID: {
            type: String,
            required: true,
        },
        Qnt: {
            type: Number,
        },
    }],
    total_amount: {
        type: Number
    },
    Order_status: {
        type: String,
        default: 'Pending'
    },
    Email: {
        type: String,
        required: true,
    }
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
