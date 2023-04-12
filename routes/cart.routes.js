const express=require('express')
const router=express.Router()
var bodyParser = require('body-parser')

const Cart=require('../models/cart.model')
const Menus=require('../models/menu.model')
const Orders=require('../models/orders.model')
router.use(express.json({ extended: true }))
router.use( bodyParser.urlencoded({extended : true }));


router.get('/:owner', async(req,res) => {
    // try{
    //     const cart_list=await Cart.find()
    //     res.status(200).json(cart_list)
    // }
    // catch(err){
    //     res.status(500).json({message:err.message})
    // }
    try{
        const cart=await Cart.find({owner:{$eq:req.params.owner}}) 
        if(cart==null){
            return res.status(404).json({message:'No such phone no found'})
        }
        res.status(200).json(cart)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.get('/', async(req,res) => {
    // try{
    //     const cart_list=await Cart.find()
    //     res.status(200).json(cart_list)
    // }
    // catch(err){
    //     res.status(500).json({message:err.message})
    // }
    try{
        const cart=await Cart.find() 
        if(cart==null){
            return res.status(404).json({message:'No such phone no found'})
        }
        res.status(200).json(cart)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})



router.post('/',async(req,res) => {
    const {menu_id,quantity}=req.body;
    const owner=req.body.owner
    try{
        const cart=await Cart.findOne({owner})
        const item=await Menus.findOne({_id:menu_id})
        if (!item) {
            res.status(404).json({ message: "item not found" });
            return;
        }
        const price = req.body.price;
        const name = req.body.name;

        if(cart){ 
            const itemIndex=cart.items.findIndex((item) => item.menu_id === menu_id)

            if(itemIndex > -1){
                let product=cart.items[itemIndex];
                product.quantity += quantity;  
                cart.items[itemIndex] = product;
                await cart.save();
                res.status(200).json(cart);
            }
            else{
                cart.items.push({ menu_id, name, quantity, price });
                await cart.save();
                res.status(200).send(cart);
            }
        }
        else{
            const cart_upload=new Cart({
                owner:req.body.owner,
                items:[{
                    menu_id:req.body.menu_id,
                    name:req.body.name,
                    quantity:req.body.quantity,
                    price:req.body.price,
                    bill: quantity * price
                }]
            })
            const new_cart=await cart_upload.save()
            res.status(201).json(new_cart)
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
     }
})


router.delete('/:owner/:menu_id',async(req,res) => {
   
    const menu_id=req.params.menu_id
    try{
        let cart=await Cart.findOne({owner:{$eq:req.params.owner}})
        const itemIndex=cart.items.findIndex((item) => item.menu_id == menu_id)
        if(itemIndex > -1 ){
            let item=cart.items[itemIndex];

            let product=cart.items[itemIndex]
            if(product.quantity >1){
                product.quantity--;
                cart.items[itemIndex]=product;
                cart=await cart.save();
                res.status(200).json(cart)
            }
            else{
                cart.items.splice(itemIndex,1);
                cart=await cart.save()
                res.status(200).json(cart)
            }
 
             
        }
        else{
            res.status(404).send("item not found");
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})



async function checkItemExists(req,res,next){
    
}
  

module.exports=router