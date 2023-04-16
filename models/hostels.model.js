const mongoose=require('mongoose')


const HostelSchema=new mongoose.Schema({
    label:{
        type:String,
    },
    value:{
        type:String
    }
   
})






module.exports=mongoose.model('Hostels',HostelSchema)