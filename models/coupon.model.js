const mongoose = require('mongoose');

var couponSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry:{
        type: Date,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
    },
    mob_list:[{
            mob: String
        }]
});

module.exports = mongoose.model("Coupon", couponSchema);