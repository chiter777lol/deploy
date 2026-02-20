import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../store/cartSlice'
import { TrashIcon } from '@heroicons/react/24/outline'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value)
    if (quantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity }))
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
      
      <div className="flex-1">
        <div className="text-sm text-gray-500">ID: {item.id}</div>
        <div className="font-semibold">{item.name}</div>
      </div>
      
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 input-field text-center"
        />
        
        <div className="font-bold text-blue-600 w-24 text-right">
          {(item.price * item.quantity).toLocaleString()} ₽
        </div>
        
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default CartItem
