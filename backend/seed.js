const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB подключен');

    // Очищаем коллекции
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Создаем категории
    const categories = await Category.insertMany([
      { name: 'Одежда', slug: 'clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop' },
      { name: 'Обувь', slug: 'shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop' },
      { name: 'Аксессуары', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop' },
      { name: 'Косметика', slug: 'cosmetics', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop' },
      { name: 'Декор', slug: 'decor', image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=400&h=300&fit=crop' },
      { name: 'Книги', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop' }
    ]);

    // Хешируем пароли для пользователей
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash('123456', salt);
    const hashedPassword2 = await bcrypt.hash('admin123', salt);

    // Создаем пользователей
    await User.insertMany([
      {
        name: 'Анна Кузнецова',
        email: 'anna@mail.ru',
        password: hashedPassword1,
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=b6e3f4',
        phone: '+7 (999) 123-45-67',
        address: 'Москва, ул. Тверская, 15',
        birthDate: '1995-05-20'
      },
      {
        name: 'Администратор',
        email: 'admin@shop.ru',
        password: hashedPassword2,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=ffd5dc',
        phone: '+7 (999) 000-00-00',
        address: 'Москва, Деловой центр',
        birthDate: '1988-03-10'
      }
    ]);

    // Создаем товары
    await Product.insertMany([
      {
        name: 'Хлопковая футболка оверсайз',
        categoryId: categories[0]._id,
        price: 2900,
        stock: 45,
        description: 'Мягкая хлопковая футболка свободного кроя. Состав: 100% хлопок. Цвет: белый.',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
        available: true,
        rating: 4.7,
        reviews: 89
      },
      {
        name: 'Кожаные ботинки челси',
        categoryId: categories[1]._id,
        price: 12900,
        stock: 23,
        description: 'Классические ботинки челси из натуральной кожи.',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
        available: true,
        rating: 4.9,
        reviews: 87
      },
      {
        name: 'Сумка тоут из экокожи',
        categoryId: categories[2]._id,
        price: 5900,
        stock: 42,
        description: 'Вместительная сумка-тоут из качественной экокожи.',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
        available: true,
        rating: 4.7,
        reviews: 56
      },
      {
        name: 'Шерстяное пальто оверсайз',
        categoryId: categories[0]._id,
        price: 18900,
        stock: 15,
        description: 'Элегантное пальто из мягкой шерсти. Свободный крой.',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
        available: true,
        rating: 4.8,
        reviews: 124
      }
    ]);

    console.log('Тестовые данные успешно добавлены');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
};

seedDatabase();
