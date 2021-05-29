const { User } = require('../model/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const users = await User.find().select('-passwordHash');

    if(!users) {
        return res.status(500).send({
            success: false,
            message: 'No data here'
        });
    }

    res.status(200).send({
        success: true,
        total: users.length, 
        users: users
    });
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id).select('-passwordHash')
        .then(user => {
            if(user) {
                return res.status(200).json(user);
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
})

router.post('/', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.hash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
    });

    user.save().then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            success: false
        });
    });
});

router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.hash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
    },
    { new: true })
    .then(user => {
        if(user) {
            return res.status(200).json(user);
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

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(user) {
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

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.MERN_SHOP;

    if(!user) {
        return res.status(400).send({
            success: false,
            message: 'User not found'
        });
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }, secret, {
            expiresIn: '1d'
        });

        res.status(200).send({
            success: true,
            message: 'You are authenticated',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            }, 
            token: token
        });
    } else {
        res.status(400).send({
            success: false,
            message: 'Password is wrong',
            user: null,
            token: null
        });
    }
});

router.post('/register', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.hash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
    });

    user.save().then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).json({
            error: err,
            success: false
        });
    });
});

module.exports = router;