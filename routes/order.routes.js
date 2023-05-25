const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Orders = require('../models/orders.model');
const Cart = require('../models/cart.model');

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Get all orders
router.get('/', async (req, res) => {
  try {
    const searchRegex = new RegExp(req.query.search, 'i');
    const orderList = await Orders.find({
      $or: [
        { ordered_items_name: searchRegex },
        { phone_no: searchRegex },
        { rest_id: searchRegex },
        { menu_id: searchRegex },
        { order_pin: searchRegex },
        { order_status: searchRegex },
        { user_details: searchRegex },
        { alternative_phno: searchRegex },
      ],
    }).sort('-timestamp');
    res.status(200).json(orderList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order by phone number
router.get('/:phone_no', getByPhoneNo, async (req, res) => {
  const { phone } = res;
  res.json(phone);
});

router.post('/', async (req, res) => {
  try {
    const orderUpload = new Orders({
      ordered_items_name: req.body.ordered_items_name,
      total_orders: req.body.total_orders,
      phone_no: req.body.phone_no,
      alternative_phno: req.body.alternative_phno,
      rest_id: req.body.rest_id,
      menu_id: req.body.menu_id,
      order_details: req.body.order_details,
      order_status: req.body.order_status,
      user_details: req.body.user_details,
      total_price: req.body.total_price,
      order_pin: Math.floor(100000 + Math.random() * 900000),
    });
    const phoneNo = req.body.phone_no;
    const newOrder = await orderUpload.save();
    await Cart.deleteOne({ owner: phoneNo });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:_id', getOrderToUpdate, async (req, res) => {
  try {
    if (req.body.order_status != null) {
      const { order } = res;
      order.order_status = req.body.order_status;
      if (req.body.order_status === 'confirmed') {
        order.confirmed_at = Date.now();
      }
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(400).json({ message: 'No updates provided for order status' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:_id/:itemId', getOrderItems, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { updatedItem } = req.body;

    const { order } = res;

    // Parse the order details string to an array
    const orderDetails = JSON.parse(order.order_details);

    // Find the index of the item within the order details by item ID
    const itemIndex = orderDetails.findIndex((item) => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the order' });
    }

    // Update the item
    orderDetails[itemIndex] = updatedItem;

    // Convert the order details array back to a string
    const updatedOrderDetails = JSON.stringify(orderDetails);

    // Update the order with the updated order details
    order.order_details = updatedOrderDetails;

    // Save the updated order
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:_id', getOrderToUpdate, async (req, res) => {
  try {
    await res.order.deleteOne();
    res.json({ message: 'Deleted Order record' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getOrderToUpdate(req, res, next) {
  try {
    const order = await Orders.findById(req.params._id);
    if (!order) {
      return res.status(404).json({ message: 'No such Order ID' });
    }
    res.order = order;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByPhoneNo(req, res, next) {
  try {
    const phone = await Orders.find({ phone_no: req.params.phone_no });
    if (!phone) {
      return res.status(404).json({ message: 'No such Order ID' });
    }
    res.phone = phone;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getOrderItems(req, res, next) {
  try {
    const order = await Orders.findById(req.params._id);
    if (!order) {
      return res.status(404).json({ message: 'No such Order ID' });
    }

    // Parse the order details string to an array
    const orderDetails = JSON.parse(order.order_details);

    const { itemId } = req.params;

    // Find the item within the order details by item ID
    const item = orderDetails.find((item) => item._id.toString() === itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in the order' });
    }

    res.item = item;
    res.order = order;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = router;
