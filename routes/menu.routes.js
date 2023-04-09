const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')
// const cors=require('cors')
const Menus=require('../models/menu.model')
const Restaurents=require('../models/restaurents.model')

router.use(express.json({ extended: true }))
router.use( bodyParser.urlencoded({extended : true }));
// router.use(cors())




///get all menu
router.get('/',async(req,res) => {

    try{
        const searchRegex=new RegExp(req.query.search,'i')
        const menu_list=await Menus.find({
            $or:[
                {dish_name:searchRegex},
                {rest_id:searchRegex},
                {dish_type:searchRegex}
            ]
        })
        res.status(200).json(menu_list)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


router.get('/:rest_id',getById,(req,res) => {
    res.json(res.Id)
})

///get by dish type
router.get('/:dish_type',getByType,(req,res) => {
    res.json(res.menu)
})


// /post menus
router.post('/',checkRestaurentExists,async(req,res) =>{
    console.log(req.body)

    const menu_upload=new Menus({
        rest_id:req.body.rest_id,
        dish_name:req.body.dish_name,
        dish_type:req.body.dish_type,
        dish_price:req.body.dish_price
    })

    try{
        const new_menu=await menu_upload.save()
        res.status(201).json(new_menu)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

router.patch('/:rest_id/:_id',getMenuToDelete,async(req,res) => {
    if(req.body.rest_id!=null) {
        res.menu.rest_id=req.body.rest_id
    }
    if(req.body.dish_type!=null){
        res.menu.dish_type=req.body.dish_type
    }
    if(req.body.dish_name!=null){
        res.menu.dish_name=req.body.dish_name
    }
    if(req.body.dish_price!=null){
        res.menu.dish_price=req.body.dish_price
    }
    try{
        const updatedMenu=await res.menu.save()
        res.status(200).json(updatedMenu)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})


///delete menus
router.delete('/:rest_id/:_id',getMenuToDelete,async(req,res) => {
    try{
        await res.menu.deleteOne()
        res.json({message:"Deleted Dish item"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


async function getByType(req,res,next){
    let menu
    try{
        menu=await Menus.find({dish_type:{$eq:req.params.dish_type.toLowerCase()}})
        if(menu==null){
            return res.status(404).json({message:"No such dish type available"})
        }
    }
    catch(err){
        if(menu==undefined){
            return res.status(404).json({message:'No such dish type available'})
        }
        return res.status(500).json({message:err.message})
    }
    res.menu=menu
    next()
}

async function getMenuToDelete(req,res,next){
    let menu
    try{
        menu=await Menus.findOne({rest_id:{$eq:req.params.rest_id}, _id:{$eq:req.params._id}})
        if(menu==null){
            return res.status(404).json({message:"No such dish available at the momentz"})
        }
    }
    catch(err){
        if(menu==undefined){
            return res.status(404).json({message:'No such dish available at the momentx'})
        }
        return res.status(500).json({message:err.message})
    }
    res.menu=menu
    next()
}

async function checkRestaurentExists(req,res,next){
    let restaurent
    try{
        restaurent=await Restaurents.findOne({rest_id:req.body.rest_id})
        if(!restaurent){
            return res.status(404).json({message:'No such Restaurent ID available so cant post menu'})
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
    res.restaurent=restaurent
    next()
}

async function getById(req,res,next){
    let Id
    try{
        Id=await Menus.find({rest_id:{$eq:req.params.rest_id}})
        if(!Id){
            return res.status(404).json({message:'No such Restaurent ID available so cant post menu'})
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
    res.Id=Id
    next()
}

module.exports=router