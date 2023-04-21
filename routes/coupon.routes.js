const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')
const Coupon=require('../models/coupon.model')

router.use(express.json({ extended: true }))
router.use( bodyParser.urlencoded({extended : true }));

router.get('/:mob',async(req,res) => {
    let couponArray = []
    try{
        const coupons = await Coupon.find();
        coupons.forEach((c) => {
            c.mob_list.forEach((m) => {
                console.log(m.mob, req.params.mob);
                if(req.params.mob == m.mob) {
                    couponArray.push(c)
                }
            })
        })
        console.log(couponArray);
        res.json(couponArray);
    }catch(error){
        res.status(404).json({message: error.message}); 
    }
})

router.post('/',async(req,res) => {
    const coupon = new Coupon({
        name: req.body.name,
        expiry:req.body.expiry,
        discount:req.body.discount,
        mob_list:req.body.mob_list
    })
    try{
        const newCoupon = await Coupon.create(coupon);
        res.json(newCoupon);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

router.put('/:id',async(req,res) => {
    const {id} = req.params;
    try{
        const updatecoupons = await Coupon.findByIdAndUpdate(id, req.body, {new:true, });
        res.json(updatecoupons);
    }catch(error){
        res.status(404).json({message: error.message});
    }
})

router.delete('/:id',async(req,res) => {
    const{id}= req.params;
    try{
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    }catch(error) {
        res.status(500).json({message: error.message});
    }
})

module.exports=router;