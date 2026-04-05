const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GDProduct = require('../models/GDProduct');
const { createClient } = require('@supabase/supabase-js');

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Memory storage for immediate processing to upload to Supabase
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/gd-products
// @desc    Get all GD Products
router.get('/', async (req, res) => {
    try {
        const products = await GDProduct.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/gd-products
// @desc    Add new GD Product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, price, category, badge, description, brand, features, rating, partnerId } = req.body;
        let imageUrl = '';

        if (req.file) {
            if (!supabase) {
                return res.status(500).json({ message: 'Supabase credentials missing in .env file.' });
            }

            // Upload to Supabase
            const fileName = `gdProduct-${Date.now()}-${req.file.originalname.replace(/\\s+/g, '-')}`;
            const { data, error } = await supabase.storage
                .from('gd-products')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });
            
            if (error) {
                console.error('Supabase upload error:', error);
                return res.status(500).json({ message: 'Error uploading image to Supabase: ' + error.message });
            }

            // Get public URL
            const { data: publicData } = supabase.storage.from('gd-products').getPublicUrl(fileName);
            imageUrl = publicData.publicUrl;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        } else {
            return res.status(400).json({ message: 'Image is required' });
        }

        const newProduct = new GDProduct({
            title,
            price,
            category,
            badge: badge || null,
            description,
            brand: brand || 'UniXHub Originals',
            features: features ? JSON.parse(features) : ['Secure Transaction', 'Instant Download', 'Free Updates', 'Premium Quality'],
            rating: rating || "4.5",
            partnerId,
            image: imageUrl
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/gd-products/:id
// @desc    Update a GD Product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, price, category, badge, description, brand, features, rating } = req.body;
        const product = await GDProduct.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (req.file) {
            if (!supabase) {
                return res.status(500).json({ message: 'Supabase credentials missing in .env file.' });
            }

            const fileName = `gdProduct-${Date.now()}-${req.file.originalname.replace(/\\s+/g, '-')}`;
            const { data, error } = await supabase.storage
                .from('gd-products')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                });
            
            if (error) {
                 return res.status(500).json({ message: 'Error uploading image to Supabase: ' + error.message });
            }
            
            const { data: publicData } = supabase.storage.from('gd-products').getPublicUrl(fileName);
            product.image = publicData.publicUrl;
        }

        if (title) product.title = title;
        if (price) product.price = price;
        if (category) product.category = category;
        product.badge = badge || null; // Can be empty
        if (description) product.description = description;
        if (brand) product.brand = brand;
        if (features) product.features = JSON.parse(features);
        if (rating) product.rating = rating;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/gd-products/:id
// @desc    Delete a GD Product
router.delete('/:id', async (req, res) => {
    try {
        const product = await GDProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
