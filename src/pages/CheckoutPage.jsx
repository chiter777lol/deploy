import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { orderApi } from '../api'
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
    address: user?.address || '',
    postal_code: '',
    city: '',
    phone: user?.phone || '',
    payment_method: 'card',
    delivery_method: 'courier',
    newsletter: false,
    save_info: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const orderData = {
        ...formData,
        user_id: user.id,
        items: items,
        total: total,
        status: 'new'
      }
      
      await orderApi.create(orderData)
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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-light text-[#1e3a5f] mb-8">Оформление заказа</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-8 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-[#1e3a5f] mb-4">Контактная информация</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Имя</label>
              <input
                type="text"
                required
                className="input"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Фамилия</label>
              <input
                type="text"
                required
                className="input"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-xs font-medium text-[#89CFF0] mb-1">Email</label>
            <input
              type="email"
              required
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-xs font-medium text-[#89CFF0] mb-1">Телефон</label>
            <input
              type="tel"
              required
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
        </div>
        
        <div className="border-t-2 border-[#89CFF0]/30 pt-6">
          <h2 className="text-lg font-medium text-[#1e3a5f] mb-4">Адрес доставки</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Город</label>
              <input
                type="text"
                required
                className="input"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Индекс</label>
              <input
                type="text"
                className="input"
                value={formData.postal_code}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#89CFF0] mb-1">Адрес</label>
              <input
                type="text"
                required
                className="input"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-[#89CFF0]/30 pt-6">
          <h2 className="text-lg font-medium text-[#1e3a5f] mb-4">Способ доставки</h2>
          <div className="space-y-3">
            {[
              { value: 'courier', label: 'Курьером', price: 300 },
              { value: 'pickup', label: 'Самовывоз', price: 0 },
              { value: 'post', label: 'Почта России', price: 200 }
            ].map(option => (
              <label key={option.value} className="flex items-center justify-between p-4 border-2 border-[#89CFF0] rounded-xl cursor-pointer hover:border-[#FF6B6B] transition bg-white">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value={option.value}
                    checked={formData.delivery_method === option.value}
                    onChange={(e) => setFormData({...formData, delivery_method: e.target.value})}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium text-[#1e3a5f]">{option.label}</span>
                </div>
                <span className="text-sm font-bold text-[#FF6B6B]">{option.price > 0 ? `${option.price} ₽` : 'Бесплатно'}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="border-t-2 border-[#89CFF0]/30 pt-6">
          <h2 className="text-lg font-medium text-[#1e3a5f] mb-4">Способ оплаты</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'card', label: 'Карта' },
              { value: 'cash', label: 'Наличные' },
              { value: 'online', label: 'Онлайн' }
            ].map(option => (
              <label key={option.value} className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition ${
                formData.payment_method === option.value 
                  ? 'border-[#FF6B6B] bg-[#FFEAA7]' 
                  : 'border-[#89CFF0] hover:border-[#FF6B6B] bg-white'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={formData.payment_method === option.value}
                  onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                  className="sr-only"
                />
                <span className="text-xs font-medium text-[#1e3a5f]">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="border-t-2 border-[#89CFF0]/30 pt-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({...formData, newsletter: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="text-sm text-[#1e3a5f]">Получать новости о скидках</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.save_info}
                onChange={(e) => setFormData({...formData, save_info: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="text-sm text-[#1e3a5f]">Сохранить данные для следующих покупок</span>
            </label>
          </div>
        </div>
        
        <div className="border-t-2 border-[#89CFF0]/30 pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-[#1e3a5f]">Итого:</span>
            <span className="text-3xl font-bold text-[#FF6B6B]">{total.toLocaleString()} ₽</span>
          </div>
          
          <button type="submit" className="w-full btn-primary py-4 text-lg">
            Подтвердить заказ
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
