import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../api'
import { clearCart } from '../store/cartSlice'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, total } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    first_name: user?.name?.split(' ')[0] || '',
    last_name: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    postal_code: '',
    city: '',
    phone: '',
    payment_method: 'card',
    delivery_method: 'courier'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const orderData = {
        ...formData,
        user_id: user.id,
        items: items,
        total: total,
        status: 'new',
        created: new Date().toISOString()
      }
      
      await api.createOrder(orderData)
      dispatch(clearCart())
      toast.success('Заказ успешно оформлен!')
      navigate('/')
    } catch (error) {
      toast.error('Ошибка при оформлении заказа')
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="input-field"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            type="tel"
            required
            className="input-field"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Адрес доставки</h2>
        
        <div>
          <label className="block text-sm font-medium mb-1">Город</label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Индекс</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Адрес</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Способ доставки</h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="courier"
              checked={formData.delivery_method === 'courier'}
              onChange={(e) => setFormData({...formData, delivery_method: e.target.value})}
            />
            <span>Курьером</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="pickup"
              checked={formData.delivery_method === 'pickup'}
              onChange={(e) => setFormData({...formData, delivery_method: e.target.value})}
            />
            <span>Самовывоз</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="post"
              checked={formData.delivery_method === 'post'}
              onChange={(e) => setFormData({...formData, delivery_method: e.target.value})}
            />
            <span>Почта России</span>
          </label>
        </div>
        
        <h2 className="text-xl font-semibold mb-4 mt-6">Способ оплаты</h2>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="card"
              checked={formData.payment_method === 'card'}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
            />
            <span>Банковская карта</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="cash"
              checked={formData.payment_method === 'cash'}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
            />
            <span>Наличными при получении</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="online"
              checked={formData.payment_method === 'online'}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
            />
            <span>Онлайн-оплата</span>
          </label>
        </div>
        
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center text-xl mb-6">
            <span className="font-semibold">Итого к оплате:</span>
            <span className="font-bold text-blue-600">{total.toLocaleString()} ₽</span>
          </div>
          
          <button type="submit" className="btn-primary w-full text-lg py-3">
            Подтвердить заказ
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
