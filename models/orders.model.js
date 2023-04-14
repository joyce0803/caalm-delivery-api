const mongoose=require('mongoose')
const gpc = require('generate-pincode')

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
    },
    alternative_phno:{
        type:String
    },
    rest_id:{
        type:String
    },
    menu_id:{
        type:String,
        // ref:'Menus' 
    },
    order_status:{
        type:String
    },
    user_details:{
        type:String
    },
    order_details:{
        type:String
    },
    total_price:{
        type:Number
    },
    order_pin:{
        type:String,
        default:gpc(4) 
    }
   
})






module.exports=mongoose.model('Orders',OrderSchema)