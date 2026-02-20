import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 }
  } catch {
    return { items: [], total: 0 }
  }
}

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
        toast.success('Количество товара обновлено')
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        })
        toast.success('Товар добавлен в корзину')
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      saveCartToStorage(state)
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      saveCartToStorage(state)
      toast.success('Товар удален из корзины')
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        saveCartToStorage(state)
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.total = 0
      saveCartToStorage(state)
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
