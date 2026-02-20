import axios from './axios'

export const api = {
  // Товары
  getProducts: (params) => axios.get('/products', { params }),
  getProduct: (id) => axios.get(`/products/${id}`),
  createProduct: (data) => axios.post('/products', data),
  updateProduct: (id, data) => axios.put(`/products/${id}`, data),
  deleteProduct: (id) => axios.delete(`/products/${id}`),
  
  // Категории
  getCategories: () => axios.get('/categories'),
  getCategory: (id) => axios.get(`/categories/${id}`),
  
  // Пользователи
  login: (email, password) => axios.get(`/users?email=${email}&password=${password}`),
  register: (data) => axios.post('/users', data),
  
  // Заказы
  createOrder: (data) => axios.post('/orders', data),
  getUserOrders: (userId) => axios.get(`/orders?userId=${userId}`),
}
