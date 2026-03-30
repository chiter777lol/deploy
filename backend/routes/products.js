const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    console.log('Запрос к /api/products');
    console.log('Параметры запроса:', req.query);
    
    let query = {};

    if (req.query.categoryId) {
      const categoryIdValue = req.query.categoryId;
      console.log('Фильтр по категории (raw):', categoryIdValue);
      
      // Проверяем, является ли categoryId валидным ObjectId (24 hex символа)
      if (categoryIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        // Это ObjectId - используем напрямую
        query.categoryId = categoryIdValue;
        console.log('Фильтр как ObjectId');
      } else {
        // Это число (например "69") - ищем категорию с таким id
        const category = await Category.findOne({ id: parseInt(categoryIdValue) });
        if (category) {
          query.categoryId = category._id;
          console.log(`Нашли категорию с id=${categoryIdValue}, используем _id=${category._id}`);
        } else {
          console.log(`Категория с id=${categoryIdValue} не найдена`);
          return res.json([]);
        }
      }
    }

    let products = await Product.find(query).populate('categoryId');
    console.log('Найдено товаров:', products.length);

    // Поиск по названию
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Сортировка
    if (req.query.sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (req.query.sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    }

    // Лимит
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
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
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
    console.error('Ошибка при создании товара:', error);
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
    console.error('Ошибка при обновлении товара:', error);
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
    console.error('Ошибка при удалении товара:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;