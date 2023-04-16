require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors=require('cors')

mongoose.connect
(
    process.env.MONGODB_URI,
    {
        dbName:process.env.DB_NAME,
        user:process.env.DB_USER,
        pass:process.env.DB_PASS,
        useNewUrlParser:true 
    }
)


app.use(cors())
const db=mongoose.connection
db.on('error',(error) => console.log(error))
db.once('open',() => console.log('Connected to FoodDelivery Database'))
db.on('disconnected',() =>console.log('Database Disconnected'))

const RestaurentRoutes=require('./routes/restaurents.routes')
app.use('/restaurents',RestaurentRoutes)

const MenuRoutes=require('./routes/menu.routes')
app.use('/menus',MenuRoutes)

const OrderRoutes=require('./routes/order.routes')
app.use('/orders',OrderRoutes)

const PhotoRoutes=require('./routes/photo.routes')
app.use('/photos',PhotoRoutes)

const CartRoutes=require('./routes/cart.routes')
app.use('/cart',CartRoutes)

const HostelRoutes=require('./routes/hostel.routes')
app.use('/hostels',HostelRoutes)

const port=process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})