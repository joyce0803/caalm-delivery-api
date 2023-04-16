const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')

const Hostels=require('../models/hostels.model')

router.use(express.json({ extended: true }))
router.use( bodyParser.urlencoded({extended : true }));


router.get('/', async(req,res) => {
    try{
        const searchRegex=new RegExp(req.query.search,'i')
        const hostel_list=await Hostels.find({
            $or:[
                {label:searchRegex},
                {value:searchRegex}
            ]
        })
        res.status(200).json(hostel_list)   
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/', async(req,res) => {
    console.log(req.body)

    const hostel_upload=new Hostels({
        label:req.body.label,
        value:req.body.value
        
    })
    try{
        const new_hostel=await hostel_upload.save()
        res.status(201).json(new_hostel)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports=router
