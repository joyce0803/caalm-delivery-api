const mongoose=require('mongoose')
const shortid = require('shortid');
// const CartSchema=new mongoose.Schema({
//     order_details: [{
//         menu_id:{
//             type:String,
//         },
//         quantity:{
//             type:Number
//         }
//     }],
//     phone_no:{
//         type:String
//     },
//     total_cost: {
//         type: Number,
//         default: 0
//     },
//     other_details:{
//         type:Object
//     }
    

// })

const CartSchema=new mongoose.Schema({
    owner:{
        type:String,
        // default:shortid.generate
    },
    items:[{
        menu_id:{
            type:String,
            ref:'Menus'
        },
        name:String,
        quantity:{
            type:Number,
            min:1,
            default:1
        },
        price:Number
    }],
    bill:{
        type:Number,
        default:0
    },

})




module.exports = mongoose.model('Cart', CartSchema);