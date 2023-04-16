const mongoose=require('mongoose')


const HostelSchema=new mongoose.Schema({
    hostel_name:{
        type:String,
    }
   
})






module.exports=mongoose.model('Hostels',HostelSchema)