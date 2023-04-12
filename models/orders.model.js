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
    other_details:{
        type:String
    },
   
})






module.exports=mongoose.model('Orders',OrderSchema)