const { Order } = require('../model/order');
const { OrderItem } = require('../model/order-item');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const order = await Order.find()
        .populate('user', 'name')
        .populate({ 
            path: 'orderItems', 
            populate: { 
                path: 'product', 
                populate: 'category' 
            } 
        })
        .sort({ 'dateOrdered': -1 });

    if(!order) {
        res.status(500).json({
            success: false,
            message: 'No data here'
        });
    }

    res.status(200).json({
        success: true,
        total: order.length, 
        result: order
    });
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ path: 'orderItems', 
            populate: { 
                path: 'product', 
                populate: 'category' 
            } 
        });

    if(!order) {
        return res.status(500).json({ 
            success: false,
            message: 'Not found'
        });
    }

    res.status(200).send({
        success: true,
        result: order
    });
});

router.get('/sum/total-sales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' }}}
    ]);

    if(!totalSales) {
        return res.status(400).json({
            success: false,
            message: 'The order sales cannot be generated'
        });
    }

    res.send({ 
        success: true,  
        result: totalSales.pop().totalsales
    });
});

router.get('/user-orders/:userid', async(req, res) => {
    const orderList = await Order.find({ user: req.params.userid })
                                .populate({ path: 'orderItems', populate: {
                                    path: 'product', populate: 'category'
                                }}).sort({ dateOrdered: -1 });

    if(!orderList) {
        return res.status(500).json({
            success: false,
            message: 'No order list yet'
        });
    }

    res.send({
        success: true,
        total: orderList.length,
        result: orderList
    })
});

router.post('/', async (req, res) => {
    const orderItemsId = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id
    }));

    const orderItemsIdResolve = await orderItemsId;
    const totalPrices = await Promise.all(orderItemsIdResolve.map(async orderItemId => {
        const orderItem = await (await OrderItem.findById(orderItemId)).populate('product');
        const totalPrice = orderItem.product.price * orderItem.quantity;

        return totalPrice;
    }));

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: orderItemsIdResolve,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    order = await order.save();
    if(!order) {
        return res.status(404).send({
            success: false,
            message: "Can't create data"
        });
    }
    res.status(200).send({
        success: true,
        message: 'Data has been created',
        result: order
    });
});

router.put('/:id', async (req, res) => {
    const order = Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, { new: true });

    if(!order) {
        return res.status(500).json({
            success: false,
            message: 'Not found'
        });
    }

    res.status(200).send({
        success: true,
        message: 'Data has been updated',
        result: order
    });
})

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .then(async order => {
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            });

            return res.status(200).json({
                success: true,
                message: 'Data has been deleted'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Not found'
            });
        }
    })
    .catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        });
    });
});

module.exports = router;