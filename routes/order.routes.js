const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')
const cors=require('cors');
const Orders=require('../models/orders.model')

router.use(express.json({ extended: true }))
router.use( bodyParser.urlencoded({extended : true }));
router.use(cors());
router.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
});


////get all orders
router.get('/',async(req,res) => {

    try{
        const searchRegex=new RegExp(req.query.search,'i')
        const order_list=await Orders.find({
            $or:[
                {ordered_items_name:searchRegex},
                // {total_orders:searchRegex},
            ]
        })
        res.status(200).json(order_list)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.post('/',async(req,res) => {
    console.log(req.body)

    const order_upload=new Orders({
        ordered_items_name:req.body.ordered_items_name,
        total_orders:req.body.total_orders
    })
    try{
        const new_order=await order_upload.save()
        res.status(201).json(new_order)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

router.patch('/:_id',getOrderToUpdate,async(req,res) => {
    if(req.body.ordered_items_name!=null){
        res.order.ordered_items_name=req.body.ordered_items_name
    }
    if(req.body.total_orders!=null){
        res.order.total_orders=req.body.total_orders
    }
    try{
        const updatedOrder=await res.order.save()
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

router.delete('/:_id',getOrderToUpdate,async(req,res) => {
    try{
        await res.order.deleteOne()
        res.json({message:'Deleted Order record'})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

async function getOrderToUpdate(req,res,next){
    let order
    try{
        order=await Orders.findOne({_id:{$eq:req.params._id}})
        if(order==null){
            return res.status(404).json({message:"No such Order ID"})
        }
    }
    catch(err){
        if(order==undefined){
            return res.status(404).json({message:'No such Order ID available'})
        }
        return res.status(500).json({message:err.message})
    }
    res.order=order
    next()
}


module.exports=router