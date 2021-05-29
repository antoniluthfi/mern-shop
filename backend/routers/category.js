const { Category } = require('../model/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.find();

    if(!categories) {
        return res.status(500).json({ 
            success: false,
            message: 'No data here' 
        });
    }
    res.status(200).send(categories);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        return res.status(500).json({ 
            success: false,
            message: 'Not found'
        });
    }

    res.status(200).send({
        success: true,
        result: category
    });
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
    });

    category = await category.save();
    if(!category) {
        return res.status(404).send({
            success: false,
            message: "Can't create data"
        });
    }
    res.status(200).send({
        success: true,
        message: 'Data has been created',
        result: category
    });
});

router.put('/:id', async (req, res) => {
    const category = Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
    }, { new: true });

    if(!category) {
        return res.status(500).json({
            success: false,
            message: 'Not found'
        });
    }

    res.status(200).send({
        success: true,
        message: 'Data has been updated',
        result: category
    });
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if(category) {
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