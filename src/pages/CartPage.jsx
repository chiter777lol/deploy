import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

const CartPage = () => {
  const { items, total } = useSelector(state => state.cart)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl p-12 border-2 border-[#89CFF0]/30 shadow-lg">
          <h2 className="text-2xl font-light text-[#1e3a5f] mb-3">Корзина пуста</h2>
          <p className="text-sm text-[#89CFF0] mb-6">Добавьте товары, чтобы оформить заказ</p>
          <Link to="/products" className="btn-primary inline-block">
            Перейти к покупкам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-[#1e3a5f] mb-8">Корзина</h1>
      
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-6 mb-6">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#89CFF0]/30 p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-[#1e3a5f]">Итого:</span>
          <span className="text-3xl font-bold text-[#FF6B6B]">{total.toLocaleString()} ₽</span>
        </div>
        
        <Link 
          to="/checkout" 
          className="btn-primary w-full text-center block text-lg py-3"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  )
}

export default CartPage
