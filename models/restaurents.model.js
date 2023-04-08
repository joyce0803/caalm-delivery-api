const mongoose=require('mongoose')
const shortid = require('shortid');

const RestaurentSchema=new mongoose.Schema({
    rest_id:{
        type:String,
        default:shortid.generate
    },
    rest_name:{
        type:String
    },
    rest_image:{
        type:String
    }
})

module.exports=mongoose.model('Restaurents',RestaurentSchema)