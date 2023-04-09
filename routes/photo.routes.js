const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')
// const cors=require('cors')
const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary').v2
const Photos=require('../models/photos.model')


cloudinary.config({
    cloud_name:'dnaf2h3rw',
    api_key:'123954613469549',
    api_secret:'rvC66mX_CFuQFksACYI8iUja8tY'
})  
// router.use(cors())
router.use(express.json({ extended: true }))
router.use(bodyParser.json({ limit: "50mb" })); // support json encoded bodies
router.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
);


router.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      limits: { fileSize: 50 * 1024 * 1024 },
    })
);

//show all stories
router.get('/',async(req,res) => {
    try{
        const stories_list=await Photos.find()
        res.status(200).json(stories_list)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }  
})

///show one story
router.get('/:_id',getStory,async(req,res) => {
    try{
        res.status(200).json(res.story)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/',async(req,res) => {
    const story=req.files.story
    console.log(req.files.story)
    const story_result=await cloudinary.uploader.upload(story.tempFilePath, {
        public_id:`${Date.now()}`,
        resource_type:"auto",
        folder:"delivery_stories"
    })
    
    const story_upload=new Photos({
        photo:story_result.secure_url
    })
    try{
        const new_story=await story_upload.save()
        res.status(201).json(new_story)  
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

// update stories
router.patch('/:_id',getStory,async(req,res) => {
    if(req.files && req.files.story){
        const story=req.files.story
        const story_result=await cloudinary.uploader.upload(story.tempFilePath, {
            public_id:`${Date.now()}`,
            resource_type:"auto",
            folder:"delivery_stories"
        })
        res.story.photo=story_result.secure_url
    }
    try{
        const updatedStory=await res.story.save()
        res.status(200).json(updatedStory)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

router.delete('/:_id',getStory,async(req,res) => {
    try{
        await res.story.deleteOne()
        res.json({message:"Deleted story"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

async function getStory(req,res,next){
    let story
    try{
        story=await Photos.findOne({_id:{$eq:req.params._id}})
        if(story==null){
            return res.status(404).json({message:'No such story available '})
        }
    }
    catch(err){
       if(story==undefined){
            return res.status(404).json({message:'No such story available'})
        }
        return res.status(500).json({message:err.message}) 
    }
    res.story=story
    next()
}

module.exports=router