const mongoose=require('mongoose')

const MenuSchema=new mongoose.Schema({
    rest_id:{
        type:String
    },
    dish_name:{
        type:String,
        capitalize: true
    },
    dish_price:{
        type:String
    },
    dish_type:{
        type:String,
        lowercase: true
    },

})



module.exports=mongoose.model('Menus',MenuSchema)