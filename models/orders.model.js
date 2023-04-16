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
    },
    alternative_phno:{
        type:String
    },
    rest_id:{
        type:String
    },
    menu_id:{
        type:String,
        
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
        default:Math.floor(100000+Math.random()*900000),
        unique:true
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
   
})






module.exports=mongoose.model('Orders',OrderSchema)