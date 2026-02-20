import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

const CartPage = () => {
  const { items, total } = useSelector(state => state.cart)

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <p className="text-gray-600 mb-8">Добавьте товары в корзину, чтобы оформить заказ</p>
        <Link to="/products" className="btn-primary">
          Перейти к покупкам
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      
      {/* Итоговая стоимость */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center text-xl">
          <span className="font-semibold">Итого:</span>
          <span className="font-bold text-blue-600">{total.toLocaleString()} ₽</span>
        </div>
        
        <div className="mt-6">
          <Link 
            to="/checkout" 
            className="btn-primary w-full text-center block text-lg py-3"
          >
            Оформить заказ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
