const { Product } = require('../model/product');
const { Category } = require('../model/category');
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) uploadError = null;
        cb(uploadError, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    }
});
const uploadOptions = multer({ storage: storage });

router.get('/', async (req, res) => {
    let filter = {};
    if(req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const products = await Product.find(filter).populate('category');

    if(!products) {
        return res.status(500).send({
            success: false,
            message: 'No data here'
        });
    }

    res.status(200).send({
        success: true,
        total: products.length,
        result: products
    }); 
});

router.get('/:id', (req, res) => {
    Product.findById(req.params.id).populate('category')
    .then(product => {
        if(product) {
            if(product) {
                return res.status(200).json(product);
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Not found'
                });
            }
        }
    })
    .catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        });
    });
});

router.get('/get/featured', async (req, res) => {
    const product = await Product.find({ isFeatured: true });
    if(!productCount) {
        return res.status(500).send({
            success: false,
            message: 'No data here'
        });
    }

    res.status(200).send({
        success: true,
        total: product.length,
        result: product
    }); 
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(500).send({
            success: false,
            message: "Invalid category"
        });
    }

    const file = req.file;
    if(!file) {
        return res.status(500).send({
            success: false,
            message: "No image uploaded"
        });
    }
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, 
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
    });

    product = await product.save();
    if(!product) {
        return res.status(500).send({
            success: false,
            message: "Can't create data"
        });
    }

    res.status(200).send(product);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Product ID"
        });
    }

    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(500).json({
            success: false,
            message: "Invalid Category"
        });
    }

    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(500).json({
            success: false,
            message: "Invalid Product"
        });
    }

    const file = req.file;
    let imagePath;
    if(file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagePath = `${basePath}${fileName}`;
    } else {
        imagePath = product.image;
    }

    Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name || product.name,
        description: req.body.description || product.description,
        richDescription: req.body.richDescription || product.richDescription,
        image: imagePath, 
        images: req.body.images || product.images,
        brand: req.body.brand || product.brand,
        price: req.body.price || product.price,
        category: req.body.category || product.category,
        countInStock: req.body.countInStock || product.countInStock,
        rating: req.body.rating || product.rating,
        numReviews: req.body.numReviews || product.numReviews,
        isFeatured: req.body.isFeatured || product.isFeatured,
        dateCreated: req.body.dateCreated || product.dateCreated,
    }, 
    { new: true })
    .then(product => {
        if(product) {
            return res.status(200).json({
                success: true,
                message: 'Data has been updated'
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

router.put('/images-gallery/:id', uploadOptions.array('images', 20), async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Product ID"
        });
    }

    const files = req.files;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let imagesPath = [];

    if(files) {
        files.map(file => {
            imagesPath.push(`${basePath}${file.filename}`);
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "No images uploaded"
        });
    }

    Product.findByIdAndUpdate(req.params.id, {
        images: imagesPath,
    }, 
    { new: true })
    .then(product => {
        if(product) {
            return res.status(200).json({
                success: true,
                message: 'Data has been updated'
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

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if(product) {
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
})

module.exports = router;