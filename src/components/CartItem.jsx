import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../store/cartSlice'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value)
    if (quantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity }))
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b-2 border-[#89CFF0]/30">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-xl border-2 border-[#89CFF0]"
      />
      
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-[#89CFF0] mb-1">Арт. {item.id}</div>
        <h3 className="font-medium text-[#1e3a5f] truncate">{item.name}</h3>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 border-[#89CFF0] rounded-xl">
          <button
            onClick={() => dispatch(updateQuantity({ 
              id: item.id, 
              quantity: Math.max(1, item.quantity - 1)
            }))}
            className="px-3 py-1 hover:bg-[#FFEAA7] rounded-l-xl transition text-[#FF6B6B] font-bold"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium text-[#1e3a5f]">{item.quantity}</span>
          <button
            onClick={() => dispatch(updateQuantity({ 
              id: item.id, 
              quantity: item.quantity + 1
            }))}
            className="px-3 py-1 hover:bg-[#FFEAA7] rounded-r-xl transition text-[#FF6B6B] font-bold"
          >
            +
          </button>
        </div>
        
        <div className="w-24 text-right">
          <div className="font-bold text-[#FF6B6B]">
            {(item.price * item.quantity).toLocaleString()} ₽
          </div>
          <div className="text-xs text-[#89CFF0]">
            {item.price.toLocaleString()} ₽/шт
          </div>
        </div>
        
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="w-8 h-8 flex items-center justify-center text-[#FF6B6B] hover:text-white hover:bg-[#FF6B6B] rounded-full transition border-2 border-[#FF6B6B]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default CartItem
