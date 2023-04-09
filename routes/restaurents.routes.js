const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')

const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary').v2
const Restaurents=require('../models/restaurents.model')

router.use(express.json({ extended: true }))
router.use(fileUpload({
    useTempFiles:true
})) 
router.use( bodyParser.urlencoded({extended : true }));



cloudinary.config({
    cloud_name:'dnaf2h3rw',
    api_key:'123954613469549',
    api_secret:'rvC66mX_CFuQFksACYI8iUja8tY'
}) 

router.get('/',async(req,res) => {

    try{
        const searchRegex=new RegExp(req.query.search,'i')
        const rest_list=await Restaurents.find({
            $or:[
                {rest_name:searchRegex},
                {rest_id:searchRegex}
            ]
        })
        res.status(200).json(rest_list)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


router.post('/',async(req,res) => {
    console.log(req.body)

    const rest_image=req.files.image

    const result=await cloudinary.uploader.upload(rest_image.tempFilePath,{
        public_id:`${Date.now()}`,
        resource_type:"auto",
        folder:"restaurent_images"
    })

    const rest_upload=new Restaurents({
        rest_name:req.body.rest_name,
        rest_image:result.secure_url
    })

    try{
        const new_restaurent=await rest_upload.save()
        res.status(201).json(new_restaurent)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

router.get('/:rest_id',getRest,(req,res) => {
    res.json(res.rest)
})

router.patch('/:rest_id',getRestUpdate,async(req,res) => {

    if(req.body.rest_name!=null){
        res.rest.rest_name=req.body.rest_name
    }

    if(req.files && req.files.image){
        const image=req.files.image
        const image_result=await cloudinary.uploader.upload(image.tempFilePath,{
            public_id:`${Date.now()}`,
            resource_type:"auto",
            folder:"restaurent_images"
        })
        res.rest.rest_image=image_result.secure_url
    }
    try{
        const updatedRestaurent=await res.rest.save()
        res.status(200).json(updatedRestaurent)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})


router.delete('/:rest_id',getRestUpdate,async(req,res) => {
    try{
        await res.rest.deleteOne()
        res.json({message:'Deleted restaurent record'})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})
 

async function getRest(req,res,next){
    let rest
    try{
        rest=await Restaurents.find({rest_id:{$eq:req.params.rest_id}})
        if(rest==null){
            return res.status(404).json({message:'No such restaurent available'})
        }
    }
    catch(err){
        if(rest==undefined){
            return res.status(404).json({message:'No such restaurent available'})
        }
        return res.status(500).json({message:err.message})
    }
    res.rest=rest
    next()
}

async function getRestUpdate(req,res,next){
    let rest
    try{
        rest=await Restaurents.findOne({rest_id:{$eq:req.params.rest_id}})
        if(rest==null){
            return res.status(404).json({message:'No such restaurent available'})
        }
    }
    catch(err){
        if(rest==undefined){
            return res.status(404).json({message:'No such restaurent available'})
        }
        return res.status(500).json({message:err.message})
    }
    res.rest=rest
    next()
}

module.exports=router