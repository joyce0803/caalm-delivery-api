const mongoose=require('mongoose')

const PhotoSchema=new mongoose.Schema({
    photo:{
        type:String
    }
})

module.exports=mongoose.model('Photos',PhotoSchema)