const mongoose=require('mongoose')

const OrderSchema=new mongoose.Schema({
    ordered_items_name:{
        type:String,
        lowercase: true
    },
    total_orders:{
        type:Number
    },
    phone_no:{
        type:String
    }
})

module.exports=mongoose.model('Orders',OrderSchema)