const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    console.log('Запрос к /api/products');
    console.log('Параметры запроса:', req.query);
    
    let query = {};

    if (req.query.categoryId) {
      console.log('Фильтр по категории:', req.query.categoryId);
      query.categoryId = req.query.categoryId;
    }

    let products = await Product.find(query);
    console.log('Найдено товаров:', products.length);
    console.log('Пример товара:', products[0] ? { name: products[0].name, categoryId: products[0].categoryId } : 'нет товаров');

    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    if (req.query.sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (req.query.sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    }

    if (req.query._limit) {
      products = products.slice(0, parseInt(req.query._limit));
    }

    res.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products (только админ)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id (только админ)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id (только админ)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
