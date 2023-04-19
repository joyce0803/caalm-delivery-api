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
       
    }, 
    timestamp:{
        type: Date, required: true, default: Date.now
        
    },
    confirmed_at:{
        type:Date,
        default:""
    }
   
})






module.exports=mongoose.model('Orders',OrderSchema)